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
        
        public async Task<Response<GetExpertDtoResponse[]>> GetExperts(GetExpertDtoRequest info)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == info.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetExpertDtoResponse[]>("Invalid task id provided");

            var experts = await _context.Experts
                .Include(e =>e.User)
                .Where(e => e.PeeringTask == task)
                .Select(e => new GetExpertDtoResponse()
                {
                    Email = e.Email,
                    Name = e.User.Fullname ?? "Эксперт",
                    ImageUrl = e.User.ImageUrl ?? "",
                    TasksComplete = 1,
                    TasksAssigned = 1
                })
                .ToArrayAsync();

            return new SuccessfulResponse<GetExpertDtoResponse[]>(experts);
        }
    }
}