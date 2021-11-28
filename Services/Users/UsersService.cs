using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.User;
using patools.Models;

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
            if(existingUser != null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-10912, "This email is already in use");
                return response;
            }

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
            if(user == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-15,"User not found");
                return response;
            }

            response.Success = true;
            response.Error = null;
            response.Payload = _mapper.Map<GetRegisteredUserDTO>(user);
            return response;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}