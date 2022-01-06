using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Experts;
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

        [HttpGet("get/task={taskId}")]
        public async Task<ActionResult<GetExpertDtoResponse[]>> GetExperts(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            return Ok(await _expertsService.GetExperts(new GetExpertDtoRequest()
            {
                TaskId = taskId
            }));
        }
    }
}