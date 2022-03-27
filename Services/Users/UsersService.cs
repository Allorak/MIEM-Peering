using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Channels;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.User;
using patools.Enums;
using patools.Models;
using patools.Errors;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.StaticFiles;
using System.Configuration;
using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace patools.Services.Users
{
    public class UsersService : IUsersService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public UsersService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetNewUserDtoResponse>> AddGoogleUser(AddUserDTO newUser)
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

        public async Task<Response<GetRegisteredUserDtoResponse>> GetUserProfile(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                return new InvalidGuidIdResponse<GetRegisteredUserDtoResponse>("Invalid user id");
            
            return new SuccessfulResponse<GetRegisteredUserDtoResponse>(_mapper.Map<GetRegisteredUserDtoResponse>(user));
        }

        public async Task<Response<GetUserRoleDtoResponse>> GetUserRole(GetUserRoleDtoRequest userInfo)
        {
            //
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetUserRoleDtoResponse>("Invalid user id");

            //
            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == userInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetUserRoleDtoResponse>("Invalid task id");

            //
            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
            {
                return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                {
                    UserRole = UserRoles.Expert,
                    TaskType = null
                });
            }

            switch (user.Role)
            {
                case UserRoles.Teacher when task.Course.Teacher == user:
                    return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                    {
                        UserRole = UserRoles.Teacher,
                        TaskType = task.TaskType
                    });
                case UserRoles.Teacher:
                    return new NoAccessResponse<GetUserRoleDtoResponse>("This teacher has no access to this task");
                case UserRoles.Student:
                {
                    //
                    var courseUser = await _context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (courseUser == null)
                        return new NoAccessResponse<GetUserRoleDtoResponse>("This user isn't assigned to this task");

                    return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                    {
                        TaskType = task.TaskType,
                        UserRole = UserRoles.Student
                    });
                }
                default:
                    return new OperationErrorResponse<GetUserRoleDtoResponse>("Unknown user role");
            }
        }

        public async Task<Response<string>> AddNativeUser(AddNativeUserDto newUser)
        {
            if (string.IsNullOrEmpty(newUser.Fullname))
                return new BadRequestDataResponse<string>("There is no email");

            if (!ValidateEmail(newUser.Email))
                return new BadRequestDataResponse<string>("Not valid email");

            if (string.IsNullOrEmpty(newUser.Fullname))
                return new BadRequestDataResponse<string>("There is no password");

            if (string.IsNullOrEmpty(newUser.Fullname))
                return new BadRequestDataResponse<string>("There is no name");

            if (newUser.Role == null)
                return new BadRequestDataResponse<string>("There is no role");

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new BadRequestDataResponse<string>("User already registered");

            CreatePasswordHash(newUser.Password, out var passwordHash, out var passwordSalt);

            var user = new User()
            {
                ID = Guid.NewGuid(),
                Fullname = newUser.Fullname,
                Role = newUser.Role.Value,
                Email = newUser.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                RegisteredNatively = true
            };

            if (newUser.Img is not null)
            {
                var directory = Directory.GetCurrentDirectory();
                Console.WriteLine("The current directory is ", directory.ToString());
                var path = Path.Combine(directory, "UserImages");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var storedFilename = user.ID.ToString();

                var filepath = Path.Combine(path, storedFilename);
                await using (var fileStream = new FileStream(filepath, FileMode.Create, FileAccess.Write))
                {
                    await newUser.Img.CopyToAsync(fileStream);
                    await fileStream.DisposeAsync();
                }

                user.ImageUrl = "file:///" + filepath;
            }

            await _context.Users.AddAsync(user);

            //GetExpert - Base
            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.Email == user.Email);
            if (expert != null)
                expert.User = user;
            //
            
            await _context.SaveChangesAsync();
            return new SuccessfulResponse<string>("User added successfully");
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        private static bool ValidateEmail(string email)
        {
            var regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            var match = regex.Match(email);
            return match.Success;
        }
    }
}