using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.Tasks
{
    public class TasksService : ITasksService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public TasksService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async System.Threading.Tasks.Task<Response<GetTaskOverviewDTO>> GetTaskOverview(Guid taskId)
        {
            var response = new Response<GetTaskOverviewDTO>();

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if(task == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-15,"Task not found");
            }

            var totalAssignments = await _context.TaskUsers.CountAsync(tu => tu.Task == task);
            int submissionsNumber = 1;
            int reviewsNumber = 1;
            float[] grades = {10,10,10,10,10,10};

            var statistics = new GetTaskStatisticsDTO
            {
                Submissions = submissionsNumber,
                Review = reviewsNumber,
                Total = totalAssignments
            };
            var deadlines = _mapper.Map<GetTaskDeadlinesDTO>(task);

            response.Success = true;
            response.Error = null;
            response.Payload = new GetTaskOverviewDTO
            {
                Statistics = statistics,
                Deadlines = deadlines,
                Grades = grades
            };
            return response;
        }
    }
}