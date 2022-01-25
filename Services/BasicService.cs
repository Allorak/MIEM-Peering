using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Models;

namespace patools.Services
{
    public class BasicService
    {
        protected readonly PAToolsContext Context;
        protected readonly IMapper Mapper;
        
        protected BasicService(PAToolsContext context, IMapper mapper)
        {
            Mapper = mapper;
            Context = context;
        }
        
        protected async Task<User> GetUserById(Guid userId)
        {
            return await Context.Users.FirstOrDefaultAsync(u => u.ID == userId);
        }

        protected async Task<PeeringTask> GetTaskById(Guid taskId)
        {
            return await Context.Tasks
                .Include(t => t.Course)
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
        }

        protected async Task<bool> IsExpertUser(User user, PeeringTask task)
        {
            var expert = await Context.Experts
                .FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            return expert != null;
        }

        protected async Task<PeeringTaskUser> GetTaskUser(User student, PeeringTask task)
        {
            return await Context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
        }
        
        
        protected async Task<Submission> GetSubmission(PeeringTaskUser taskUser)
        {
            return await Context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
        }

    }
}