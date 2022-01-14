using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Models;
using Google.Apis.Auth;
using patools.Dtos.User;
using patools.Services.Users;
using System.Security.Claims;
using AutoMapper.Configuration;
using patools.Errors;
using Microsoft.Extensions.Configuration;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IUsersService _usersService;
        private readonly IConfiguration _configuration;

        public UsersController(PAToolsContext context, IUsersService usersService, IConfiguration configuration)
        {
            _context = context;
            _usersService = usersService;
            _configuration = configuration;
        }

        [HttpPost("add-google")]
        public async Task<ActionResult<GetNewUserDtoResponse>> AddGoogleUser(AddGoogleUserDTO newUser)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(newUser.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {_configuration.GetSection("AppSettings:AppId").Value}
                });

                var user = new AddUserDTO()
                {
                    Email = googleUser.Email,
                    Fullname = googleUser.Name,
                    Role = newUser.Role,
                    ImageUrl = googleUser.Picture
                };

                return Ok(await _usersService.AddGoogleUser(user));
            }
            catch(Exception)
            {
                return Ok(new UnauthorizedUserResponse());
            }
        }

        [HttpGet("get")]
        public async Task<ActionResult<GetRegisteredUserDtoResponse>> GetUserProfile()
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _usersService.GetUserProfile(userId));
        }

        [HttpGet("get-role/task={taskId}")]
        public async Task<ActionResult<GetUserRoleDtoResponse>> GetUserRole(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            var userInfo = new GetUserRoleDtoRequest()
            {
                UserId = userId,
                TaskId = taskId
            };

            return Ok(await _usersService.GetUserRole(userInfo));
        }
        
    }
}