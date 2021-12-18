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

        [HttpGet("{taskId}/overview")]
        public async System.Threading.Tasks.Task<ActionResult<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview([FromRoute]Guid taskId)
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
            
            return Ok(await _peeringTasksService.GetTaskOverview(taskId, teacherId));
        }
    }
}