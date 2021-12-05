using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Models;
using patools.Services.Tasks;
using patools.Errors;
namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ITasksService _tasksService;

        public TasksController(PAToolsContext context, ITasksService tasksService)
        {
            _tasksService = tasksService;
            _context = context;
        }

        [HttpGet("{taskId:guid}/overview")]
        public async System.Threading.Tasks.Task<IActionResult> GetTaskOverview([FromRoute]Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());
            
            return Ok(await _tasksService.GetTaskOverview(taskId, teacherId));
        }

        [HttpGet("{taskId:guid}/authorform")]
        public async System.Threading.Tasks.Task<IActionResult> GetAuthorForm([FromRoute] Guid taskId)
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

            return Ok(await _tasksService.GetAuthorForm(taskId, studentId));
        }
    }
}