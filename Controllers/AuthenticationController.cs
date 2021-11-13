using System;
using System.Threading.Tasks;
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
namespace patools.Controllers
{
    [Route("api/v1")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public AuthenticationController(PAToolsContext context)
        {
            _context = context;
        }

        [HttpPost("getjwttoken/{googleToken}")]    
        public async System.Threading.Tasks.Task<IActionResult> GetToken([FromRoute] string googleToken)    
        {    
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(googleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });

                string key = "M13m_S3cr3T-t0k3N";  
                var issuer = "http://localhost:5000";  
            
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));    
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                
                var users = _context.Users.Where(u => u.Email == googleUser.Email);
                if(!users.Any())
                    return Ok(new FailedResponse(new Error(-5,"User is not registered")));
                
                var user = users.First();
                var permClaims = new List<Claim>();    
                permClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
                permClaims.Add(new Claim("fullname",user.Fullname));
                permClaims.Add(new Claim("email",user.Email));
                permClaims.Add(new Claim("status",user.Status.ToString()));
                if(user.ImageUrl!=null)
                    permClaims.Add(new Claim("imageUrl",user.ImageUrl));

                var token = new JwtSecurityToken(issuer, //Issure    
                            issuer,  //Audience    
                            permClaims,    
                            expires: DateTime.Now.AddDays(10),    
                            signingCredentials: credentials);    
                var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);    
                return Ok(new SuccessfulResponse(new {resultToken = jwt_token})); 
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(401, "Unauthorized")));  
            }   
        }

        [HttpPost("checktoken")]
        public async System.Threading.Tasks.Task<IActionResult> CheckToken()
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new FailedResponse(new Error(401,"Unauthorized")));
            
            return Ok(new SuccessfulResponse(new {message = "Valid User"}));
        }

        [HttpPost("googleauth/{token}")]  
        public async System.Threading.Tasks.Task<IActionResult> GoogleAuth([FromRoute]string token) 
        {  
            System.Console.WriteLine(token);
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });
                var users = _context.Users.Where(u => u.Email == googleUser.Email);
                if(!users.Any())
                    return Ok(new SuccessfulResponse(new {status = "NEW"}));

                object user = users.First();
                return Ok(new SuccessfulResponse(new {status = "REGISTERED", user}));
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(401, "Unauthorized")));  
            }
        } 
    }
}
