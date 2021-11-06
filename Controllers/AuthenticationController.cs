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
namespace patools.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public AuthenticationController(PAToolsContext context)
        {
            _context = context;
        }

        [HttpGet("gettoken")]    
        public Object GetToken()    
        {    
            string key = "M13m_S3cr3T-t0k3N";  
            var issuer = "http://localhost:5000";  
        
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));    
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);  
            
            var permClaims = new List<Claim>();    
            permClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));    
            permClaims.Add(new Claim("valid", "1"));    
            permClaims.Add(new Claim("userid", "1"));    
            permClaims.Add(new Claim("email", "abc@gmail.com"));    
        
            var token = new JwtSecurityToken(issuer, //Issure    
                            issuer,  //Audience    
                            permClaims,    
                            expires: DateTime.Now.AddDays(10),    
                            signingCredentials: credentials);    
            var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);    
            return new { data = jwt_token };    
        }

        [AllowAnonymous]
        [HttpPost("googleauth/{token}")]  
        public async System.Threading.Tasks.Task<IActionResult> PostToken([FromRoute]string token) 
        {  
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });
                return Ok(new Response(new {userState = "NEW"}));
            }
            catch(Exception e)
            {
                return Ok(new Response("Unauthorized"));  
            }
        } 
    }
}
