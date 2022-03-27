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
using Newtonsoft.Json;
using patools.Enums;

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

        /// <summary>
        /// Получает токен Jwt.
        /// </summary>
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

        /// <summary>
        /// Проверяет аутентификацию по электронной почте Google.
        /// </summary>
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

        /// <summary>
        /// Выдает результат аутентификации.
        /// </summary>
        [HttpPost("lti/{taskId}")]
        public async Task<RedirectResult> LtiAuth([FromRoute] Guid taskId, [FromForm]GetJwtByLtiRequest tokenInfo)
        {
            var authenticationResult = await _authenticationService.LtiAuthentication(tokenInfo.user_data, taskId);

            if (authenticationResult.Success == false)
                return Redirect("~/not-found");

            if (authenticationResult.Payload.Token != "")
            {
                try
                {
                    
                    Response.Cookies.Append("JWT", authenticationResult.Payload.Token);
                    var redirectLink = authenticationResult.Payload.Role == UserRoles.Student
                        ? $"~/st/task/{taskId}/overview"
                        : $"~/t/task/{taskId}/overview";
                    return Redirect(redirectLink);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    return Redirect("~/not-found");
                }

            }

            Response.Cookies.Append("JWT", "");
            return Redirect("~/not-found");
        }

        /// <summary>
        /// Осуществляет вход по почте и паролю
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<Response<GetNativeRegisteredUserDtoResponse>>> Login(GetNativeRegisteredUserDtoRequest userInfo)
        {
            return Ok(await _authenticationService.Login(userInfo));
        }
    }
}
