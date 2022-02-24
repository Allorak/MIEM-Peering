using System;
using System.IO;
using System.Net.Http;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Auth;
using Microsoft.Extensions.Configuration;
using patools.Dtos.User;
using Microsoft.AspNetCore.Authentication;
using patools.Services.Authentication;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using patools.Errors;

namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly patools.Services.Authentication.IAuthenticationService _authenticationService;
        private readonly IConfiguration _configuration;

        public AuthenticationController(patools.Services.Authentication.IAuthenticationService authenticationService, IConfiguration configuration)
        {
            _configuration = configuration;
            _authenticationService = authenticationService;
        }

        [HttpGet("get-jwt-token")]
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

        [HttpPost("google")]
        public async Task<ActionResult<Response<GetGoogleRegisteredUserDtoResponse>>> GoogleAuth([FromBody]GetJwtByGoogleDtoRequest tokenInfo)
        {
            try
            {
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

        [HttpPost("lti/{taskId}")]
        public async void LtiAuth([FromRoute] Guid taskId,[FromForm] GetJwtByLtiRequest tokenInfo)
        {
            var isUserRegisteredResult = await _authenticationService.IsLtiTokenUserRegistered(tokenInfo.user_data);
            if (isUserRegisteredResult.Success == false)
                return;
            if (isUserRegisteredResult.Payload != "")
            {
                try
                {
                    Response.Cookies.Append("JWT", isUserRegisteredResult.Payload);
                    Response.Redirect($"{_configuration.GetSection("LTI:RedirectFromLTI").Value}/{taskId}/overview");
                }
                catch
                {
                    
                }

                return;
            }

            try
            {
                Response.Cookies.Append("JWT", "");
                Response.Redirect("~/login");
            }
            catch
            {
                // ignored
            }
        }
    }
}
