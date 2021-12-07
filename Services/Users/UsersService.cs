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

        public async Task<Response<GetNewUserDTO>> AddGoogleUser(User newUser)
        {
            var response = new Response<GetNewUserDTO>();
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new UserAlreadyRegisteredResponse<GetNewUserDTO>();

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Error = null;
            response.Payload = _mapper.Map<GetNewUserDTO>(newUser);
            return response;
        }

        public async Task<Response<GetRegisteredUserDTO>> GetUserProfile(Guid userId)
        {
            var response = new Response<GetRegisteredUserDTO>();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                return new InvalidGuidIdResponse<GetRegisteredUserDTO>("Invalid user id");
            
            response.Success = true;
            response.Error = null;
            response.Payload = _mapper.Map<GetRegisteredUserDTO>(user);
            return response;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}