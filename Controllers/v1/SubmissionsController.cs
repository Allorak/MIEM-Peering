using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Submission;
using patools.Errors;
using patools.Models;
using patools.Services.Courses;
using patools.Services.Submissions;
using patools.Services.Tasks;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class SubmissionsController:ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ISubmissionsService _submissionsService;
        
        public SubmissionsController(PAToolsContext context, ISubmissionsService submissionsService)
        {
            _context = context;
            _submissionsService = submissionsService;
        }

        [HttpPost("add")]
        public async Task<ActionResult<string>> AddSubmission(AddSubmissionDto submission)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if(!User.IsInRole(UserRoles.Student.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(studentIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(studentIdClaim.Value, out var studentId))
                return Ok(new InvalidGuidIdResponse());

            submission.UserId = studentId;
            return Ok(await _submissionsService.AddSubmission(submission));
        }
        
    }
}