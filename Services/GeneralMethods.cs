using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Models;

namespace patools.Services
{
    public class BasicService
    {
        protected readonly PAToolsContext _context;
        protected readonly IMapper _mapper;
        
        protected BasicService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        protected async Task<User> GetUserById(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
        }

        protected async Task<PeeringTask> GetTaskById(Guid taskId)
        {
            return await _context.Tasks
                .Include(t => t.Course)
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
        }

        protected async Task<bool> IsExpertUser(User user, PeeringTask task)
        {
            var expert = await _context.Experts
                .FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            return expert != null;
        }

        protected async Task<PeeringTaskUser> GetTaskUser(User student, PeeringTask task)
        {
            return await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
        }
        
        
        protected async Task<Submission> GetSubmission(PeeringTaskUser taskUser)
        {
            return await _context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
        }

    }
}