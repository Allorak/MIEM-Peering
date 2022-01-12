using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.SubmissionPeer;
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
        
        [HttpGet("peerform/task={taskId}")]
        public async Task<ActionResult<GetAuthorFormDtoResponse>> GetPeerForm(Guid taskId)
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
            var taskInfo = new GetPeerFormDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            };
            return Ok(await _peeringTasksService.GetPeerForm(taskInfo));
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

            return Ok(new InvalidJwtTokenResponse());
        }

        [HttpGet("submissionDeadline/task={taskId}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetSubmissionDeadline([FromRoute] Guid taskId)
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

            return Ok(await _peeringTasksService.GetTaskSubmissionDeadline(new GetTaskDeadlineDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }
        
        [HttpGet("reviewDeadline/task={taskId}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetReviewDeadline([FromRoute] Guid taskId)
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

            return Ok(await _peeringTasksService.GetTaskReviewDeadline(new GetTaskDeadlineDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }

        [HttpPost("assign-peers/task={taskId}")]
        public async Task<ActionResult<string>> AssignPeers([FromRoute] Guid taskId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return Ok(new InvalidGuidIdResponse("invalid task id"));
            return Ok(await _peeringTasksService.AssignPeers(new AssignPeersDto()
            {
                TaskId = taskId
            }));
        }
        
        [HttpPost("assign-experts/task={taskId}")]
        public async Task<ActionResult<string>> AssignExperts([FromRoute] Guid taskId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return Ok(new InvalidGuidIdResponse("invalid task id"));
            return Ok(await _peeringTasksService.AssignExperts(new AssignExpertsDto()
            {
                TaskId = taskId
            }));
        }
        
        [HttpPost("create-test-peers/task={taskId}")]
        public async Task<ActionResult<string>> CreateTestPeers([FromRoute] Guid taskId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return Ok(new InvalidGuidIdResponse("invalid task id"));
            var testUsers = new List<User>();
            for (int i = 0; i < 50; i++)
            {
                testUsers.Add(new User()
                {
                    ID = Guid.NewGuid(),
                    Email = "",
                    Fullname = $"TestUser #{i+1} for task {task.ID}",
                    Role = UserRoles.Student
                });
            }
            await _context.Users.AddRangeAsync(testUsers);
            
            var taskUserConnections = new List<PeeringTaskUser>();
            foreach (var user in testUsers)
            {
                taskUserConnections.Add(new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = task,
                    State = PeeringTaskStates.Assigned,
                    Student = user
                });
            }
            await _context.TaskUsers.AddRangeAsync(taskUserConnections);

            var submissions = new List<Submission>();
            foreach (var taskUser in taskUserConnections)
            {
                submissions.Add(new Submission()
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = taskUser
                });
            }
            await _context.Submissions.AddRangeAsync(submissions);

            await _context.SaveChangesAsync();
            
            return Ok($"Test peers with submissions created for task {task.ID}");
        }

        [HttpPost("create-test-experts/task={taskId}")]
        public async Task<ActionResult<string>> CreateTestExperts([FromRoute] Guid taskId)
        {
            await CreateTestPeers(taskId);
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            var testExpertUsers = new List<User>();
            for (int i = 0; i < 5; i++)
            {
                testExpertUsers.Add(new User()
                {
                    ID =Guid.NewGuid(),
                    Email = "",
                    Fullname = $"TestExpert #{i+1} for task {taskId}",
                    Role = UserRoles.Student
                });
            }
            await _context.Users.AddRangeAsync(testExpertUsers);

            var experts = new List<Expert>();
            foreach (var user in testExpertUsers)
            {
                experts.Add(new Expert()
                {
                    ID = Guid.NewGuid(),
                    Email = user.Email,
                    PeeringTask = task,
                    User = user
                });
            }

            for (int i = 0; i < 2; i++)
            {
                experts.Add(new Expert()
                {
                    ID = Guid.NewGuid(),
                    Email = $"Non-registered expert #{i+1} (task - {taskId})",
                    PeeringTask = task
                });
            }

            await _context.Experts.AddRangeAsync(experts);

            await _context.SaveChangesAsync();

            return Ok($"Test experts created for task {taskId}");
        }
    }
}