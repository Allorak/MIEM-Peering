using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Models;
using patools.Services.Tasks;

namespace patools.Controllers
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

        [HttpGet("{taskId}/overview")]
        public async System.Threading.Tasks.Task<IActionResult> GetTaskOverview([FromRoute] string taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            Guid guidTaskId;
            if(!Guid.TryParse(taskId,out guidTaskId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _tasksService.GetTaskOverview(guidTaskId));
        }
    }
}