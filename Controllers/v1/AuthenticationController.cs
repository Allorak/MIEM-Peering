using System;
using System.Collections.Generic;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using patools.Models;
using System.Linq;
using project401.Dtos.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using project401.Dtos.User;

namespace patools.Controllers
{
    [ApiController]
    [Route("api/v1")]
    public class AuthenticationController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthenticationController(PAToolsContext context, IConfiguration configuration, IMapper mapper)
        {
            _mapper = mapper;
            _configuration = configuration;
            _context = context;
        }

        [HttpGet("getjwttoken/")]
        public async System.Threading.Tasks.Task<ActionResult<Response>> GetJWTToken([FromBody]GoogleTokenDTO userInfo)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(userInfo.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == googleUser.Email);
                if(user == null)
                    return Ok(new FailedResponse(new Error(-5,"User is not registered")));

                var permClaims = new List<Claim>()
                {
                    new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                    new Claim(ClaimTypes.Name, user.Fullname),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:TokenSecret").Value));

                var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(permClaims),
                    Expires = DateTime.Now.AddDays(10),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new SuccessfulResponse(new GetJWTTokenDTO {AccessToken = tokenHandler.WriteToken(token)}));
            }
            catch(Exception)
            {
                return Unauthorized(new FailedResponse(new Error(401, "Unauthorized")));
            }
        }

        [HttpPost("checktoken")]
        public async System.Threading.Tasks.Task<ActionResult<Response>> CheckToken()
        {
            System.Console.WriteLine("Authorized - " + User.Identity.IsAuthenticated);
            System.Console.WriteLine("Name - " + User.Identity.Name);
            System.Console.WriteLine("Role student - " + User.IsInRole(UserRoles.Student.ToString()));
            System.Console.WriteLine("Role teacher - " + User.IsInRole(UserRoles.Teacher.ToString()));
            if(!User.Identity.IsAuthenticated)
                return Unauthorized(new FailedResponse(new Error(401,"Unauthorized")));

            return Ok(new SuccessfulResponse(new {message = "Valid User"}));
        }

        [HttpPost("googleauth/")]
        public async System.Threading.Tasks.Task<ActionResult<Response>> GoogleAuth([FromBody]GoogleTokenDTO tokenInfo)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(tokenInfo.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == googleUser.Email);
                if(user == null)
                    return Ok(new SuccessfulResponse(new GoogleGetRegisteredUserDTO {Status = "NEW"}));

                return Ok(new SuccessfulResponse(new GoogleGetRegisteredUserDTO{Status = "REGISTERED", User=_mapper.Map<GetRegisteredUserDTO>(user)}));
            }
            catch(Exception)
            {
                return Unauthorized(new FailedResponse(new Error(401, "Unauthorized")));
            }
        }
    }
}
