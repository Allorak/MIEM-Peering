using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Enums;
using patools.Models;

namespace patools.Services
{
    public class ServiceBase
    {
        protected const int MinPossibleGrade = 0;
        protected const int MaxPossibleGrade = 10;
        protected const float BadConfidenceFactorBorder = 0.35f;
        protected const float DecentConfidenceFactorBorder = 0.75f;
        
        protected readonly PAToolsContext Context;
        protected readonly IMapper Mapper;

        protected ServiceBase(PAToolsContext context, IMapper mapper)
        {
            Mapper = mapper;
            Context = context;
        }

        protected async Task<User> GetUserById(Guid userId)
        {
            return await Context.Users.FirstOrDefaultAsync(u => u.ID == userId);
        }

        protected async Task<User> GetUserById(Guid userId, UserRoles role)
        {
            return await Context.Users.FirstOrDefaultAsync(u => u.ID == userId && u.Role == role); 
        }
        
        protected async Task<User> GetUserByEmail(string email)
        {
            return await Context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        protected async Task<PeeringTask> GetTaskById(Guid taskId)
        {
            return await Context.Tasks
                .Include(t => t.Course)
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
        }

        protected async Task<Course> GetCourseById(Guid courseId)
        {
            return await Context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.ID == courseId);
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

        protected async Task<CourseUser> GetCourseUser(User student, Course course)
        {
            return await Context.CourseUsers.FirstOrDefaultAsync(cu =>
                cu.Course == course && cu.User == student);
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
                .Include(tu => tu.PeeringTask.Course)
                .Include(tu => tu.PeeringTask.Course.Teacher)
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

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(IEnumerable<Submission> submissions, User excludingTeacher = null)
        {
            var submissionPeers = await Context.SubmissionPeers
                .Include(sp => sp.Peer)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.Student)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.PeeringTask)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Where(sp => submissions.Contains(sp.Submission))
                .ToListAsync();
            if (excludingTeacher != null)
                submissionPeers = submissionPeers.Where(sp => sp.Peer != excludingTeacher).ToList();
            return submissionPeers;
        }

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(IEnumerable<PeeringTaskUser> taskUsers, User excludingTeacher = null)
        {
            return await GetSubmissionPeerAssignments(await GetSubmissionsForTask(taskUsers),excludingTeacher);
        }
        
        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(PeeringTask task, User excludingTeacher = null)
        {
            return await GetSubmissionPeerAssignments(await GetSubmissionsForTask(task),excludingTeacher);
        }

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignments(Submission submission, User excludingTeacher = null)
        {
            var submissionPeers = await Context.SubmissionPeers
                .Where(sp => sp.Submission == submission)
                .ToListAsync();

            if (excludingTeacher != null)
                submissionPeers = submissionPeers.Where(sp => sp.Peer != excludingTeacher).ToList();
            
            return submissionPeers;
        }

        protected async Task<List<SubmissionPeer>> GetSubmissionPeerAssignmentsForPeer(PeeringTask task, User peer)
        {
            return await Context.SubmissionPeers
                .Where(sp =>
                    sp.Peer == peer &&
                    sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
        }
        protected async Task<List<Review>> GetTaskReviews(IEnumerable<SubmissionPeer> submissionPeers)
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
        protected async Task<List<Review>> GetTaskReviews(IEnumerable<Submission> submissions)
        {
            return await GetTaskReviews(await GetSubmissionPeerAssignments(submissions));
        }
        protected async Task<List<Review>> GetTaskReviews(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return await GetTaskReviews(await GetSubmissionPeerAssignments(taskUsers));
        }
        protected async Task<List<Review>> GetTaskReviews(PeeringTask task)
        {
            return await GetTaskReviews(await GetSubmissionPeerAssignments(task));
        }

        protected async Task<List<Review>> GetTaskUserReviews(PeeringTaskUser taskUser)
        {
            return await Context.Reviews
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser)
                .ToListAsync();
        }

        protected async Task<float?> GetPeerPreviousConfidenceFactor(User peer, PeeringTask task)
        {
            var taskUser = await GetTaskUser(peer, task);
            return taskUser.PreviousConfidenceFactor;
        }
        protected async Task<List<Review>> GetReviewsByPeer(PeeringTask task, User peer)
        {
            return await Context.Reviews
                .Include(r => r.SubmissionPeerAssignment)
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Where(r => 
                    r.SubmissionPeerAssignment.Peer == peer &&
                    r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
        }

        protected async Task<List<Answer>> GetReviewSelectAnswers(Review review)
        {
            return await Context.Answers
                .Where(a => a.Review == review &&
                            a.Question.Type == QuestionTypes.Select)
                .OrderBy(a => a.Question)
                .Include(a => a.Question)
                .ToListAsync();
        }
        protected async Task<List<Review>> GetSubmissionReviews(Submission submission)
        {
            return await Context.Reviews
                .Where(r => r.SubmissionPeerAssignment.Submission == submission)
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .ToListAsync();
        }
        protected async Task<PeeringTask> GetInitialTask(Course course)
        {
            return await Context.Tasks.FirstOrDefaultAsync(t => 
                t.Course == course && t.TaskType == TaskTypes.Initial);
        }

        protected static List<float?> GetFinalGrades(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.FinalGrade).ToList();
        }
        protected static List<float> GetPreviousConfidenceFactors(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.PreviousConfidenceFactor).ToList();
        }
        protected static List<float?> GetNextConfidenceFactors(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.NextConfidenceFactor).ToList();
        }

        protected async Task<List<User>> GetExpertUsersForTask(PeeringTask task)
        {
            return await Context.Experts
                .Where(e => e.PeeringTask == task)
                .Select(e => e.User)
                .ToListAsync();
        }
    }
}