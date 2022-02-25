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

        public async Task<Response<string>> IsLtiTokenUserRegistered(string userToken)
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

            var user = await GetUserByEmail(email);

            return user != null ? new SuccessfulResponse<string>(CreateJwtFromUser(user)) : new SuccessfulResponse<string>("");
        }
        private static byte[] FromBase64Url(string base64Url)
        {
            var padded = base64Url.Length % 4 == 0
                ? base64Url : base64Url + "===="[(base64Url.Length % 4)..];
            var base64 = padded.Replace("_", "/")
                .Replace("-", "+");
            return Convert.FromBase64String(base64);
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