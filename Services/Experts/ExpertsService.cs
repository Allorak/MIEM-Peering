using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Experts;
using patools.Errors;
using patools.Models;

namespace patools.Services.Experts
{
    public class ExpertsService : IExpertsService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public ExpertsService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        public async Task<Response<IEnumerable<GetExpertDtoResponse>>> GetExperts(GetExpertDtoRequest info)
        {
            var task = await _context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == info.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<IEnumerable<GetExpertDtoResponse>>("Invalid task id provided");

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == info.TeacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<IEnumerable<GetExpertDtoResponse>>("Invalid teacher id");

            if (task.Course.Teacher != teacher)
                return new NoAccessResponse<IEnumerable<GetExpertDtoResponse>>("This teacher has no access to this task");
            
            var experts = await _context.Experts
                .Include(e =>e.User)
                .Where(e => e.PeeringTask == task)
                .ToArrayAsync();

            var resultExperts = new List<GetExpertDtoResponse>();
            foreach (var expert in experts)
            {
                var resultExpert = new GetExpertDtoResponse()
                {
                    Email = expert.Email,
                    Name = expert.User?.Fullname,
                    ImageUrl = expert.User?.ImageUrl,
                    TasksAssigned = null,
                    TasksCompleted = null
                };
                if (expert.User != null && task.ExpertsAssigned == true)
                {
                    var assignedTasks = await _context.SubmissionPeers
                        .Where(sp =>
                            sp.Peer == expert.User && sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                        .ToListAsync();
                    var completedTasks = await _context.Reviews
                        .Where(r => assignedTasks.Contains(r.SubmissionPeerAssignment))
                        .ToListAsync();

                    resultExpert.TasksAssigned = assignedTasks.Count;
                    resultExpert.TasksCompleted = completedTasks.Count;
                }
                resultExperts.Add(resultExpert);
            }
            return new SuccessfulResponse<IEnumerable<GetExpertDtoResponse>>(resultExperts);
        }
    }
}