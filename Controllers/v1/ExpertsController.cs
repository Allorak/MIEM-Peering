using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Experts;
using patools.Enums;
using patools.Errors;
using patools.Models;
using patools.Services.Experts;
using patools.Services.PeeringTasks;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ExpertsController:ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IPeeringTasksService _peeringTasksService;
        private readonly IExpertsService _expertsService;

        public ExpertsController(PAToolsContext context,IPeeringTasksService peeringTasksService,IExpertsService expertsService)
        {
            _peeringTasksService = peeringTasksService;
            _context = context;
            _expertsService = expertsService;
        }

        /// <summary>
        /// Получает экспертов задачи.
        /// </summary>
        [HttpGet("get/task={taskId}")]
        public async Task<ActionResult<IEnumerable<GetExpertDtoResponse>>> GetExperts(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidGuidIdResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            var taskInfo = new GetExpertDtoRequest()
            {
                TeacherId = teacherId,
                TaskId = taskId
            };
            return Ok(await _expertsService.GetExperts(taskInfo));
        }
    }
}