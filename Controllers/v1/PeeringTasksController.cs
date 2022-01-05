using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Task;
using patools.Enums;
using patools.Models;
using patools.Services.PeeringTasks;
using patools.Errors;
namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IPeeringTasksService _peeringTasksService;

        public TasksController(PAToolsContext context, IPeeringTasksService peeringTasksService)
        {
            _peeringTasksService = peeringTasksService;
            _context = context;
        }

        [HttpGet("overview/task={taskId}")]
        public async Task<ActionResult<GetPeeringTaskTeacherOverviewDtoResponse>> GetTaskOverview(Guid taskId)
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

            if (User.IsInRole(UserRoles.Teacher.ToString()))
            {
                var taskInfo = new GetPeeringTaskTeacherOverviewDtoRequest()
                {
                    TeacherId = userId,
                    TaskId = taskId
                };
                return Ok(await _peeringTasksService.GetTaskTeacherOverview(taskInfo));
            }

            if (User.IsInRole(UserRoles.Student.ToString()))
            {
                var taskInfo = new GetPeeringTaskStudentOverviewRequest()
                {
                    StudentId = userId,
                    TaskId = taskId
                };
                return Ok(await _peeringTasksService.GetTaskStudentOverview(taskInfo));
            }

            return Ok(new InvalidJwtTokenResponse());
        }

        [HttpGet("authorform/task={taskId}")]
        public async Task<ActionResult<GetAuthorFormDtoResponse>> GetAuthorForm(Guid taskId)
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
            var taskInfo = new GetAuthorFormDtoRequest
            {
                TaskId = taskId,
                UserId = userId
            };
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
        
        [HttpGet("get/course={courseId}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetCourseTasks([FromRoute]Guid courseId)
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

            var taskCourseInfo = new GetCourseTasksDtoRequest
            {
                CourseId = courseId,
                UserId = userId
            };

            if (User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(await _peeringTasksService.GetTeacherCourseTasks(taskCourseInfo));

            if(User.IsInRole(UserRoles.Student.ToString()))
                return Ok(await _peeringTasksService.GetStudentCourseTasks(taskCourseInfo));

            if(User.IsInRole(UserRoles.Expert.ToString()))
                return Ok(await _peeringTasksService.GetExpertCourseTasks(taskCourseInfo));
            
            return Ok(new InvalidJwtTokenResponse());
        }
    }
}