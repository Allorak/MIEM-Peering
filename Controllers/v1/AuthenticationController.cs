using System;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Auth;
using Microsoft.Extensions.Configuration;
using patools.Dtos.User;
using Microsoft.AspNetCore.Authentication;
using patools.Services.Authentication;
using System.Threading.Tasks;
using patools.Errors;

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
        public async Task<ActionResult<Response<GetJwtTokenDtoResponse>>> GetJwtToken([FromBody]GetJwtByGoogleDtoRequest userInfo)
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
                return Ok(new UnauthorizedUserResponse());
            }
        }

        [HttpPost("googleauth")]
        public async Task<ActionResult<Response<GetGoogleRegisteredUserDtoResponse>>> GoogleAuth([FromBody]GetJwtByGoogleDtoRequest tokenInfo)
        {
            try
            {
                System.Console.WriteLine($"Google - {tokenInfo.GoogleToken}"); // TODO: remove after all the testing
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(tokenInfo.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {_configuration.GetSection("AppSettings:AppId").Value}
                });
                return Ok(await _authenticationService.FindUserByEmail(googleUser.Email));
            }
            catch(Exception)
            {
                return Ok(new UnauthorizedUserResponse());
            }
        }
    }
}
