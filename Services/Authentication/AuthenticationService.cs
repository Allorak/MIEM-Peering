using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Text;
using Newtonsoft.Json.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using patools.Dtos.Auth;
using patools.Dtos.User;
using patools.Errors;
using patools.Models;
using SystemTask = System.Threading.Tasks;
using patools.Enums;

namespace patools.Services.Authentication
{
    public class AuthenticationService : ServiceBase,IAuthenticationService
    {
        private readonly IConfiguration _configuration;
        public AuthenticationService(PAToolsContext context, IMapper mapper, IConfiguration configuration) : base(context,mapper)
        {
            _configuration = configuration;
        }

        public async Task<Response<GetGoogleRegisteredUserDtoResponse>> FindUserByEmail(string email)
        {
            //GetUser - Base
            var user = await Context.Users.FirstOrDefaultAsync(u => u.Email == email);
            //

            if(user == null)
            {
                return new SuccessfulResponse<GetGoogleRegisteredUserDtoResponse>
                    (new GetGoogleRegisteredUserDtoResponse()
                    {
                        Status = "NEW",
                        User = null 
                    });
            }

            System.Console.WriteLine($"Jwt - {CreateJwtFromUser(user)}");
            return new SuccessfulResponse<GetGoogleRegisteredUserDtoResponse>
            (new GetGoogleRegisteredUserDtoResponse()
            {
                Status = "REGISTERED",
                AccessToken = CreateJwtFromUser(user),
                User = Mapper.Map<GetRegisteredUserDtoResponse>(user)
            });
        }

        public async Task<Response<LtiAuthenticationResponseDto>> LtiAuthentication(string userToken, Guid taskId)
        {
            Console.WriteLine(userToken);
            var payload = userToken.Split(".")[1];
            var payloadJson = Encoding.UTF8.GetString(FromBase64Url(payload));
            var payloadData = JObject.Parse(payloadJson);

            if (!payloadData.ContainsKey("user_email"))
                return new InvalidJwtTokenResponse<LtiAuthenticationResponseDto>();
            if (!payloadData.ContainsKey("user_is_student"))
                return new InvalidJwtTokenResponse<LtiAuthenticationResponseDto>();
            if (!payloadData.ContainsKey("user_is_instructor"))
                return new InvalidJwtTokenResponse<LtiAuthenticationResponseDto>();
            if (!payloadData.ContainsKey("user_full_name"))
                return new InvalidJwtTokenResponse<LtiAuthenticationResponseDto>();

            var email = payloadData["user_email"]?.ToString();
            var isStudent = payloadData["user_is_student"]?.ToString() == "True";
            var isTeacher = payloadData["user_is_instructor"]?.ToString()  == "True";
            var fullname = payloadData["user_full_name"]?.ToString();

            var task = await Context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return new InvalidGuidIdResponse<LtiAuthenticationResponseDto>("Invalid task id provided");

            var course = await Context.Courses.FirstOrDefaultAsync(c => c == task.Course);
            if (course == null)
                return new OperationErrorResponse<LtiAuthenticationResponseDto>("The database has an error");
            
            var user = await GetUserByEmail(email);
            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.Email == email);
            if (user != null)
            {
                if (isTeacher || expert!=null)
                    return new SuccessfulResponse<LtiAuthenticationResponseDto>(new LtiAuthenticationResponseDto()
                    {
                        Role = user.Role,
                        Token = CreateJwtFromUser(user)
                    });
                var courseUser = await Context.CourseUsers.FirstOrDefaultAsync(cu => cu.Course == course && cu.User == user);
                if (courseUser == null)
                {
                    await Context.CourseUsers.AddAsync(new CourseUser()
                    {
                        ID = Guid.NewGuid(),
                        Course = course,
                        User = user,
                        ConfidenceFactor = 0
                    });
                }

                var assignedTaskUsers = await Context.TaskUsers
                    .Where(tu => tu.PeeringTask.Course == course && tu.Student == user)
                    .ToListAsync();

                var assignedTasks = assignedTaskUsers.Select(tu => tu.PeeringTask).ToList();
                
                foreach (var taskUser in assignedTaskUsers)
                {
                    taskUser.JoinedByLti = true;
                }
                    
                var tasksWithoutAccess = await Context.Tasks
                    .Where(t => t.Course == course && !assignedTasks.Contains(t))
                    .ToListAsync();

                foreach (var unassignedTask in tasksWithoutAccess)
                {
                    await Context.TaskUsers.AddAsync(new PeeringTaskUser()
                    {
                        ID = Guid.NewGuid(),
                        PeeringTask = unassignedTask,
                        Student = user,
                        State = PeeringTaskStates.Assigned,
                        PreviousConfidenceFactor = 0,
                        JoinedByLti = true
                    });
                }

                await Context.SaveChangesAsync();
                
                return new SuccessfulResponse<LtiAuthenticationResponseDto>(new LtiAuthenticationResponseDto()
                {
                    Token = CreateJwtFromUser(user),
                    Role = UserRoles.Student
                });
            }

            var newUser = new User()
                {
                    ID = Guid.NewGuid(),
                    Email = email,
                    Fullname = fullname,
                    Role = isStudent ? UserRoles.Student : UserRoles.Teacher
                };

            await Context.Users.AddAsync(newUser);
            if (expert != null)
            {
                expert.User = newUser;
                await Context.SaveChangesAsync();
                return new SuccessfulResponse<LtiAuthenticationResponseDto>(new LtiAuthenticationResponseDto()
                {
                    Role = newUser.Role,
                    Token = CreateJwtFromUser(newUser)
                });
            }

            if (newUser.Role == UserRoles.Student)
            {
                await Context.CourseUsers.AddAsync(new CourseUser()
                {
                    ID = Guid.NewGuid(),
                    User = newUser,
                    Course = course,
                    ConfidenceFactor = 0
                });

                var tasks = await Context.Tasks.Where(t => t.Course == course).ToListAsync();
                foreach (var peeringTask in tasks)
                {
                    await Context.TaskUsers.AddAsync(new PeeringTaskUser()
                    {
                        ID = Guid.NewGuid(),
                        PeeringTask = peeringTask,
                        Student = newUser,
                        PreviousConfidenceFactor = 0,
                        State = PeeringTaskStates.Assigned,
                        JoinedByLti = true
                    });
                }
            }

            await Context.SaveChangesAsync();
            return new SuccessfulResponse<LtiAuthenticationResponseDto>(new LtiAuthenticationResponseDto()
            {
                Token = CreateJwtFromUser(newUser),
                Role = isTeacher ? UserRoles.Teacher : UserRoles.Student
            });
        }

        public async Task<Response<GetNativeRegisteredUserDtoResponse>> Login(GetNativeRegisteredUserDtoRequest userInfo)
        {
            var user = await GetUserByEmail(userInfo.Email);
            if (user is null)
                return new UnauthorizedUserResponse<GetNativeRegisteredUserDtoResponse>("User is not registered");

            if (!user.RegisteredNatively)
                return new UnauthorizedUserResponse<GetNativeRegisteredUserDtoResponse>(
                    "User is not registered natively");
            if (VerifyPasswordHash(userInfo.Pass, user.PasswordHash, user.PasswordSalt))
                return new SuccessfulResponse<GetNativeRegisteredUserDtoResponse>(
                    new GetNativeRegisteredUserDtoResponse()
                    {
                        AccessToken = CreateJwtFromUser(user)
                    });
            return new UnauthorizedUserResponse<GetNativeRegisteredUserDtoResponse>("Incorrect password");
        }

        private static byte[] FromBase64Url(string base64Url)
        {
            var padded = base64Url.Length % 4 == 0
                ? base64Url : base64Url + "===="[(base64Url.Length % 4)..];
            var base64 = padded.Replace("_", "/")
                .Replace("-", "+");
            return Convert.FromBase64String(base64);
        }

        private async Task<Response<GetNewUserDtoResponse>> AddUser(AddUserDTO newUser)
        {
            //GetUser - Base
            var existingUser = await Context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new UserAlreadyRegisteredResponse<GetNewUserDtoResponse>();
            //

            var user = Mapper.Map<User>(newUser);
            user.ID = Guid.NewGuid();
            await Context.Users.AddAsync(user);

            //GetExpert - Base
            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.Email == user.Email);
            if (expert != null)
                expert.User = user;
            //

            await Context.SaveChangesAsync();
            return new SuccessfulResponse<GetNewUserDtoResponse>(Mapper.Map<GetNewUserDtoResponse>(user));
        }

        public async Task<Response<GetJwtTokenDtoResponse>> GetJwtByEmail(string email)
        {
            //GetUser - Base
            var user = await Context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null)
                return new BadRequestDataResponse<GetJwtTokenDtoResponse>("The user is not registered");
            //

            var response = new SuccessfulResponse<GetJwtTokenDtoResponse>
            (new GetJwtTokenDtoResponse
            {
                AccessToken = CreateJwtFromUser(user)
            });
            return response;
        }

        private string CreateJwtFromUser(User user)
        {
            var permClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                new Claim(ClaimTypes.Name, user.Fullname),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:TokenSecret").Value));

            var credentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(permClaims),
                Expires = DateTime.Now.AddDays(14),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        
        
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            if (computedHash.Length != passwordHash.Length)
                return false;
            for (var i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != passwordHash[i])
                    return false;
            }
            return true;
        }
    }
}