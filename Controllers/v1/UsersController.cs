using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Models;
using Google.Apis.Auth;
using patools.Dtos.User;
using patools.Services.Users;

namespace patools.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IUsersService _usersService;

        public UsersController(PAToolsContext context, IUsersService usersService)
        {
            _context = context;
            _usersService = usersService;
        }

        [HttpPost("google/add")]
        public async Task<ActionResult<GetNewUserDTO>> AddGoogleUser(AddGoogleUserDTO newUser)
        {
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(newUser.GoogleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });

                var user = new User()
                {
                    ID = Guid.NewGuid(),
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
    }
}