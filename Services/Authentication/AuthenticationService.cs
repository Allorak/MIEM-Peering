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
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;
        public AuthenticationService(PAToolsContext context, IMapper mapper, IConfiguration configuration) : base(context,mapper)
        {
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
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

        public async Task<Response<string>> IsLtiTokenUserRegistered(string userToken, Guid taskId)
        {
            Console.WriteLine(userToken);
            var payload = userToken.Split(".")[1];
            var payloadJson = Encoding.UTF8.GetString(FromBase64Url(payload));
            var payloadData = JObject.Parse(payloadJson);

            if (!payloadData.ContainsKey("user_email"))
                return new InvalidJwtTokenResponse<string>();
            if (!payloadData.ContainsKey("user_is_student"))
                return new InvalidJwtTokenResponse<string>();
            if (!payloadData.ContainsKey("user_is_instructor"))
                return new InvalidJwtTokenResponse<string>();
            if (!payloadData.ContainsKey("user_full_name"))
                return new InvalidJwtTokenResponse<string>();

            var email = payloadData["user_email"]?.ToString();
            var isStudent = payloadData["user_is_student"]?.ToString() == "True";
            var isTeacher = payloadData["user_is_instructor"]?.ToString()  == "True";
            var fullname = payloadData["user_full_name"]?.ToString();

            // Found user
            var user = await GetUserByEmail(email);
            if (user != null)
            {
                return new SuccessfulResponse<string>(CreateJwtFromUser(user));
            }

            // Register user
            var newUser = new AddUserDTO()
                {
                    Email = email,
                    Fullname = fullname,
                    Role = isStudent ? UserRoles.Student : UserRoles.Teacher,
                    ImageUrl = ""
                };

            var addedUser = await AddUser(newUser);

            var newUser1 = await GetUserByEmail(email);

            if (addedUser.Success)
            {
                if (addedUser.Payload.Role == UserRoles.Student)
                {
                    var task = await _context.Tasks.FirstOrDefaultAsync(task => task.ID == taskId);
                    if (task != null)
                    {
                        var course = task.Course;

                        var courseUser = new CourseUser()
                        {
                            ID = Guid.NewGuid(),
                            Course = course,
                            User = newUser1
                        };
                        await _context.AddAsync(courseUser);

                        var tasks = await _context.Tasks
                            .Where(t => t.Course == course)
                            .ToListAsync();

                        foreach(var i in tasks)
                        {
                            var taskUser = new PeeringTaskUser()
                            {
                                ID = Guid.NewGuid(),
                                PeeringTask = i,
                                Student = newUser1,
                                State = PeeringTaskStates.Assigned
                            };
                            await _context.AddAsync(taskUser);
                        }
                        await _context.SaveChangesAsync();

                        return new SuccessfulResponse<string>(CreateJwtFromUser(newUser1));


                    }
                    return new InvalidJwtTokenResponse<string>();
                }
                return new InvalidJwtTokenResponse<string>();
            }
            return new InvalidJwtTokenResponse<string>();
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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new UserAlreadyRegisteredResponse<GetNewUserDtoResponse>();
            //

            var user = _mapper.Map<User>(newUser);
            user.ID = Guid.NewGuid();
            await _context.Users.AddAsync(user);

            //GetExpert - Base
            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.Email == user.Email);
            if (expert != null)
                expert.User = user;
            //

            await _context.SaveChangesAsync();
            return new SuccessfulResponse<GetNewUserDtoResponse>(_mapper.Map<GetNewUserDtoResponse>(user));
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
    }
}