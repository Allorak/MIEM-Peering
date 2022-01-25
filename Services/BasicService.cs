using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Models;

namespace patools.Services
{
    public class BasicService
    {
        protected const int MinPossibleGrade = 0;
        protected const int MaxPossibleGrade = 10;
        protected const float BadAverageConfidenceFactor = 1f/3;
        protected const float DecentAverageConfidenceFactor = 2f/3;
        
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

        protected async Task<List<PeeringTaskUser>> GetTaskUserAssignments(PeeringTask task)
        {
            return await Context.TaskUsers
                .Include(tu => tu.Student)
                .Include(tu => tu.PeeringTask)
                .Where(tu => tu.PeeringTask == task)
                .ToListAsync();
        }

        protected async Task<List<Submission>> GetSubmissionsForTask(PeeringTask task)
        {
            return await GetSubmissionsForTask(await GetTaskUserAssignments(task));
        }

        protected async Task<List<Submission>> GetSubmissionsForTask(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return await Context.Submissions
                .Include(s => s.PeeringTaskUserAssignment.Student)
                .Include(s => s.PeeringTaskUserAssignment.PeeringTask)
                .Include(s => s.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Where(s => taskUsers.Contains(s.PeeringTaskUserAssignment))
                .ToListAsync();
        }

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(IEnumerable<Submission> submissions)
        {
            return await Context.SubmissionPeers
                .Include(sp => sp.Peer)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.Student)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.PeeringTask)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Where(sp => submissions.Contains(sp.Submission))
                .ToListAsync();
        }

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return await GetSubmissionPeerAssignments(await GetSubmissionsForTask(taskUsers));
        }
        
        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(PeeringTask task)
        {
            return await GetSubmissionPeerAssignments(await GetSubmissionsForTask(task));
        }

        protected async Task<List<Review>> GetReviewsForTask(IEnumerable<SubmissionPeer> submissionPeers)
        {
            return await Context.Reviews
                .Include(r => r.SubmissionPeerAssignment)
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Where(r => submissionPeers.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();
        }
        protected async Task<List<Review>> GetReviewsForTask(IEnumerable<Submission> submissions)
        {
            return await GetReviewsForTask(await GetSubmissionPeerAssignments(submissions));
        }
        protected async Task<List<Review>> GetReviewsForTask(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return await GetReviewsForTask(await GetSubmissionPeerAssignments(taskUsers));
        }
        protected async Task<List<Review>> GetReviewsForTask(PeeringTask task)
        {
            return await GetReviewsForTask(await GetSubmissionPeerAssignments(task));
        }
    }
}