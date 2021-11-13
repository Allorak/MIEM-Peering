using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Models;
using Google.Apis.Auth;

namespace patools.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public UsersController(PAToolsContext context)
        {
            _context = context;
        }

        [HttpPost("add/{token}")]
        public async System.Threading.Tasks.Task<IActionResult> AddUser([FromRoute] string token, [FromBody] string role) 
        {  
            try
            {
                var googleUser = await GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] {"232154519390-nlp3m4fjjeosrvo8gld3l6lo7cd2v3na.apps.googleusercontent.com"}
                });
                var users = _context.Users.Where(u => u.Email == googleUser.Email);
                if(users.Any())
                    return Ok(new FailedResponse(new Error(-10912, "This email is already in use")));


                var status = UserStatuses.Student;
                switch (role.ToLower())
                {
                    case "student":
                        status = UserStatuses.Student;
                        break;
                    case "teacher":
                        status = UserStatuses.Teacher;
                        break;
                    case "expert":
                        status = UserStatuses.Expert;
                        break;
                }
                var user = new User();
                user.ID = Guid.NewGuid();
                user.Email = googleUser.Email;
                user.Fullname = googleUser.Name;
                user.Status = status;
                if(googleUser.Picture != String.Empty)
                    user.ImageUrl = googleUser.Picture;
                
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(new SuccessfulResponse(new {message = "User added successfully"}));
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(401, "Unauthorized")));  
            }
        } 
    }
}