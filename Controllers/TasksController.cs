using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Models;

namespace patools.Controllers
{
    [ApiController]
    [Route("api/v1/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public TasksController(PAToolsContext context)
        {
            _context = context;
        }

        [HttpGet("{taskId}/overview")]
        public async System.Threading.Tasks.Task<IActionResult> GetTaskOverview([FromRoute] string taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new FailedResponse(new Error(401,"Unauthorized")));
            
            Guid guidTaskId;
            if(!Guid.TryParse(taskId,out guidTaskId))
                return Ok(new FailedResponse(new Error(256612,"Wrong task id")));

            var tasks = _context.Tasks.Where(t => t.ID == guidTaskId);

            if(!tasks.Any()) 
                return Ok(new FailedResponse(new Error(256612,"Wrong task id")));

            var task = tasks.First();

            var totalAssignments = _context.TaskUsers.Where(tu => tu.Task == task).Count();
            int submissionsNumber = 1;
            int reviewsNumber = 1;
            float[] grades = {10,10,10,10,10,10};

            return Ok(new SuccessfulResponse(new {
                statistics = new 
                {
                    submissions = submissionsNumber,
                    total = totalAssignments,
                    review = reviewsNumber
                },
                deadlines = new 
                {
                    sBegin = task.StartDatetime,
                    sEnd = task.CompletionDeadlineDatetime,
                    rBegin = task.CheckStartDatetime,
                    rEnd = task.CheckDeadlineDatetime
                },
                grades
            }));
        }
    }
}