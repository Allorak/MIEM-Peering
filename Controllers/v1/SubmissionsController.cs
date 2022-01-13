using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Submission;
using patools.Enums;
using patools.Errors;
using patools.Models;
using patools.Services.Courses;
using patools.Services.Submissions;
using patools.Services.PeeringTasks;

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
        public async Task<ActionResult<GetNewSubmissionDtoResponse>> AddSubmission(AddSubmissionDto submission)
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

        [HttpGet("get/task={taskId}")]
        public async Task<ActionResult<GetAllSubmissionsMainInfoDtoResponse>> GetSubmissionsInfo(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            var taskInfo = new GetAllSubmissionsMainInfoDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            };
            return Ok(await _submissionsService.GetSubmissions(taskInfo));
        }

        [HttpGet("getsubmissionId/task={taskId}")]
        public async Task<ActionResult<GetSubmissionIdDtoResponse>> GetSubmissionId(Guid taskId)
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

            var taskInfo = new GetSubmissionIdDtoRequest()
            {
                TaskId = taskId,
                UserId = studentId
            };
            return Ok(await _submissionsService.GetSubmissionIdForStudents(taskInfo));
        }

        [HttpGet("get/submission={submissionId}")]
        public async Task<ActionResult<GetSubmissionDtoResponse>> GetSubmission([FromRoute] Guid submissionId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _submissionsService.GetSubmission(new GetSubmissionDtoRequest()
            {
                StudentId = userId,
                SubmissionId = submissionId
            }));
        }

        [HttpGet("getstatus/task={taskId}")]
        public async Task<ActionResult<SubmissionStatus>> GetSubmissionStatus(Guid taskId)
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

            return Ok(await _submissionsService.GetSubmissionStatus(new CanSubmitDto()
            {
                StudentId = studentId,
                TaskId = taskId
            }));
        }

        [HttpGet("get-checks-catalog/task={taskId}")]
        public async Task<ActionResult<IEnumerable<GetSubmissionToCheckDtoResponse>>> GetChecksCatalog([FromRoute] Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _submissionsService.GetChecksCatalog(new GetSubmissionToCheckDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }
    }
}