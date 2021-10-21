using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;    
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;  
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace patools.Controllers
{
    public class AuthenticationController : Controller
    {

        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(ILogger<AuthenticationController> logger)
        {
            _logger = logger;
        }

        [HttpGet("gettoken")]    
        public Object GetToken()    
        {    
            string key = "M13m_S3cr3T-t0k3N"; //Secret key which will be used later during validation    
            var issuer = "http://localhost:5000";  //normally this will be your site URL    
        
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));    
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);    
        
            var permClaims = new List<Claim>();    
            permClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));    
            permClaims.Add(new Claim("valid", "1"));    
            permClaims.Add(new Claim("userid", "1"));    
            permClaims.Add(new Claim("name", "bilal"));    
        
            var token = new JwtSecurityToken(issuer, //Issure    
                            issuer,  //Audience    
                            permClaims,    
                            expires: DateTime.Now.AddDays(1),    
                            signingCredentials: credentials);    
            var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);    
            return new { data = jwt_token };    
        }
        
        [Authorize]  
        [HttpPost("posttoken")]  
        public Object PostToken() 
        {  
            var identity = User.Identity as ClaimsIdentity;  
            if (identity != null) 
            {  
                return new { payload = new {userState =  "NEW"}, success = true};  
            }  
            return null;  
        } 
    }
}
