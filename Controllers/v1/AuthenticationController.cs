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
        public async Task<RedirectResult> LtiAuth([FromRoute] Guid taskId, [FromForm]GetJwtByLtiRequest tokenInfo)
        {
            // Если пользователь не зареган и is_instuctor === true, то надо авторизовать его как создателя курса и записать в куки его токен
            // в LMS могу быть несоклько преподов в одном курсе, а при переходе они всегда будут авторизованы под одним пользователем -- создателем курса

            // Если пользователь не зареган и is_student === true, то:
            //  1) Зарегать его
            //  2) Привязать его к курсу
            //  3) Привязать его ко всем тасками соответсвуещего курса

            // Перекидывать на соответсвующий Overview

            // /t/task/2d15220e-3a5e-4d9e-9446-9d381007f806/overview --- teacher
            // /st/task/2d15220e-3a5e-4d9e-9446-9d381007f806/overview --- student

            // Если что-то пошло не так (токен invalid), или таск не обнаружен, то перекидывать на /not-found

            var isUserRegisteredResult = await _authenticationService.IsLtiTokenUserRegistered(tokenInfo.user_data, taskId);

            // Auth error
            if (isUserRegisteredResult.Success == false)
                return Redirect("~/not-found");

            if (isUserRegisteredResult.Payload != "")
            {
                try
                {
                    
                    Response.Cookies.Append("JWT", isUserRegisteredResult.Payload);
                    return Redirect($"~/st/task/{taskId}/overview");
                }
                catch
                {
                    // invalid token
                    return Redirect("~/not-found");
                }

            }

            try
            {
                Response.Cookies.Append("JWT", "");
                // register user
                return Redirect("~/not-found");
            }
            catch
            {
                return Redirect("~/not-found");
            }
        }
    }
}
