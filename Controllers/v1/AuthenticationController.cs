using System;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Auth;
using Microsoft.Extensions.Configuration;
using patools.Dtos.User;
using Microsoft.AspNetCore.Authentication;
using patools.Services.Authentication;
using System.Threading.Tasks;

namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1")]
    public class AuthenticationController : ControllerBase
    {
        private readonly patools.Services.Authentication.IAuthenticationService _authenticationService;
        private readonly IConfiguration _configuration;

        public AuthenticationController(patools.Services.Authentication.IAuthenticationService authenticationService, IConfiguration configuration)
        {
            _configuration = configuration;
            _authenticationService = authenticationService;
        }

        [HttpGet("getjwttoken")]
        public async Task<ActionResult<Response<GetJWTTokenDTO>>> GetJWTToken([FromBody]GoogleTokenDTO userInfo)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(userInfo.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {_configuration.GetSection("AppSettings:AppId").Value}
                });

                return Ok(await _authenticationService.GetJwtByEmail(googleUser.Email));
            }
            catch(Exception)
            {
                return Unauthorized(new UnauthorizedUserResponse());
            }
        }

        [HttpPost("googleauth")]
        public async Task<ActionResult<Response<GoogleGetRegisteredUserDTO>>> GoogleAuth([FromBody]GoogleTokenDTO tokenInfo)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(tokenInfo.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });
                return Ok(await _authenticationService.FindUserByEmail(googleUser.Email));
            }
            catch(Exception)
            {
                return Unauthorized(new UnauthorizedUserResponse());
            }
        }
    }
}
