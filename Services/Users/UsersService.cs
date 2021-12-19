using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.User;
using patools.Models;
using patools.Errors;
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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new UserAlreadyRegisteredResponse<GetNewUserDtoResponse>();

            var user = _mapper.Map<User>(newUser);
            user.ID = Guid.NewGuid();
            await _context.Users.AddAsync(user);
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

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}