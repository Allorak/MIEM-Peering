using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Task;
using patools.Models;
using patools.Services.PeeringTasks;
using patools.Errors;
namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IPeeringTasksService _peeringTasksService;

        public TasksController(PAToolsContext context, IPeeringTasksService peeringTasksService)
        {
            _peeringTasksService = peeringTasksService;
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<ActionResult<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview(GetPeeringTaskOverviewDtoRequest taskInfo)
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
            
            taskInfo.TeacherId = teacherId;
            return Ok(await _peeringTasksService.GetTaskOverview(taskInfo));
        }

        [HttpGet("authorform")]
        public async Task<ActionResult<GetAuthorFormDtoResponse>> GetAuthorForm(GetAuthorFormDtoRequest taskInfo)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());
            taskInfo.UserId = userId;
            return Ok(await _peeringTasksService.GetAuthorForm(taskInfo));
        }
        
        [HttpPost("add")]
        public async Task<ActionResult<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask)
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

            peeringTask.TeacherId = teacherId;
            return Ok(await _peeringTasksService.AddTask(peeringTask));
        }
        
        [HttpGet("get")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetCourseTasks(GetCourseTasksDtoRequest taskCourseInfo)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            UserRoles? role = null;
            if(User.IsInRole(UserRoles.Teacher.ToString()))
                role = UserRoles.Teacher;
            if(User.IsInRole(UserRoles.Student.ToString()))
                role = UserRoles.Student;
            if (!role.HasValue)
                return Ok(new InvalidJwtTokenResponse());
            
            
            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            taskCourseInfo.UserId = userId;
            taskCourseInfo.UserRole = role.Value;
            return Ok(await _peeringTasksService.GetCourseTasks(taskCourseInfo));
        }
    }
}