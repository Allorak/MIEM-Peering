using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using patools.Dtos.Auth;
using patools.Dtos.User;
using patools.Errors;
using patools.Models;
using SystemTask = System.Threading.Tasks;

namespace patools.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public AuthenticationService(PAToolsContext context, IMapper mapper, IConfiguration configuration)
        {
            _configuration = configuration;
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GoogleGetRegisteredUserDTO>> FindUserByEmail(string email)
        {
            var response = new Response<GoogleGetRegisteredUserDTO>();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            response.Success = true;
            response.Error = null;
            if(user == null)
            {
                response.Payload = new GoogleGetRegisteredUserDTO
                {
                    Status = "NEW",
                    User = null
                };

                return response;
            }

            response.Payload = new GoogleGetRegisteredUserDTO
            {
                Status = "REGISTERED",
                AccessToken = CreateJwtFromUser(user),
                User = _mapper.Map<GetRegisteredUserDTO>(user)
            };
            return response;
        }

        public async Task<Response<GetJWTTokenDTO>> GetJwtByEmail(string email)
        {
            var response = new Response<GetJWTTokenDTO>();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null)
                return new BadRequestDataResponse<GetJWTTokenDTO>("The user is not registered");

            response.Success = true;
            response.Error = null;
            response.Payload = new GetJWTTokenDTO
            {
                AccessToken = CreateJwtFromUser(user)
            };
            System.Console.WriteLine($"Jwt - {response.Payload.AccessToken}");
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
                Expires = DateTime.Now.AddDays(10),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}