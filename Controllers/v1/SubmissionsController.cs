using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Claims;
using System.Threading.Tasks;
using BrunoZell.ModelBinding;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using patools.Dtos.Answer;
using patools.Dtos.Submission;
using patools.Enums;
using patools.Errors;
using patools.Models;
using patools.Services.Courses;
using patools.Services.Files;
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
        private readonly IFilesService _filesService;
        
        public SubmissionsController(PAToolsContext context, ISubmissionsService submissionsService, IFilesService filesService)
        {
            _context = context;
            _submissionsService = submissionsService;
            _filesService = filesService;
        }

        [HttpPost("add")]
        public async Task<ActionResult<GetNewSubmissionDtoResponse>> AddSubmission([FromForm] Guid taskId, [FromForm] [ModelBinder(BinderType = typeof(JsonModelBinder))] AddAnswerDto[] answers,  [FromForm] IList<IFormFile> files)
        {
            var submission = new AddSubmissionDto()
            {
                TaskId = taskId,
                Answers = answers,
                Files = files
            };

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

        [HttpGet("get/task={taskId:guid}")]
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

        [HttpGet("get-id/task={taskId:guid}")]
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

        [HttpGet("get/submission={submissionId:guid}")]
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

        [HttpGet("get-status/task={taskId:guid}")]
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

        [HttpGet("get-checks-catalog/task={taskId:guid}")]
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

        [HttpGet("get-metadata/submission={submissionId:guid}")]
        public async Task<ActionResult<GetSubmissionMetadataDtoResponse>> GetSubmissionMetadata(Guid submissionId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());
            
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _submissionsService.GetSubmissionMetadata(new GetSubmissionMetadataDtoRequest()
            {
                SubmissionId = submissionId,
                TeacherId = teacherId
            }));
        }
    }
}