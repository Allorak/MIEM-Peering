using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Task;
using patools.Models;
using patools.Errors;
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

        public async Task<Response<GetNewTaskDTO>> AddTask(Guid courseId, Guid teacherId, AddTaskDTO task)
        {
            var response = new Response<GetNewTaskDTO>();

            var course = await _context.Courses.Include(c => c.Teacher).FirstOrDefaultAsync(c => c.ID == courseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetNewTaskDTO>("Invalid course id");

            if (course.Teacher.ID != teacherId)
                return new NoAccessResponse<GetNewTaskDTO>("This teacher has no access to this course");

            var newTask = new Models.Task
            {
                ID = Guid.NewGuid(),
                Title = task.MainInfo.Title,
                Description = task.MainInfo.Description,
                Course = course,
                SubmissionStartDateTime = task.Settings.SubmissionStartDateTime,
                SubmissionEndDateTime = task.Settings.SubmissionEndDateTime,
                ReviewStartDateTime = task.Settings.ReviewStartDateTime,
                ReviewEndDateTime = task.Settings.ReviewEndDateTime,
                SubmissionsToCheck = task.Settings.SubmissionsToCheck
            };
            await _context.Tasks.AddAsync(newTask);
            await _context.SaveChangesAsync();


            foreach(var authorQuestion in task.AuthorForm.Rubrics)
            {
                var newAuthorQuestion = _mapper.Map<Question>(authorQuestion);
                newAuthorQuestion.ID = Guid.NewGuid();
                newAuthorQuestion.Task = newTask;
                newAuthorQuestion.RespondentType = RespondentTypes.Author;
                await _context.Questions.AddAsync(newAuthorQuestion);
            }

            foreach(var peerQuestion in task.PeerForm.Rubrics)
            {
                var newPeerQuestion = _mapper.Map<Question>(peerQuestion);
                newPeerQuestion.ID = Guid.NewGuid();
                newPeerQuestion.Task = newTask;
                newPeerQuestion.RespondentType = RespondentTypes.Peer;
                await _context.Questions.AddAsync(newPeerQuestion);
            }

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Error = null;
            response.Payload = _mapper.Map<GetNewTaskDTO>(newTask);
            return response;
        }

        public async Task<Response<List<GetTaskMainInfoDTO>>> GetCourseTasks(Guid courseId, Guid userId, UserRoles userRole)
        {
            var response = new Response<List<GetTaskMainInfoDTO>>();

            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseId);
            if (course == null)
                return new InvalidGuidIdResponse<List<GetTaskMainInfoDTO>>("Invalid course id");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.ID == userId);
            if (user == null)
                return new InvalidGuidIdResponse<List<GetTaskMainInfoDTO>>("Invalid user id");

            var courseUserConnection = await _context.CourseUsers.FirstOrDefaultAsync(x => x.User.ID == user.ID && x.Course.ID == courseId);

            if(userRole == UserRoles.Teacher && course.Teacher != user)
                response.Payload = null;
            else if(userRole == UserRoles.Student && courseUserConnection == null)
                response.Payload = null;
            else
            {
                var tasks = await _context.Tasks
                                    .Where(t => t.Course.ID == courseId)
                                    .Select(x => _mapper.Map<GetTaskMainInfoDTO>(x))
                                    .ToListAsync();
                response.Payload = tasks;
            }
            response.Success = true;
            response.Error = null;
            return response;
        }

        public async System.Threading.Tasks.Task<Response<GetTaskOverviewDTO>> GetTaskOverview(Guid taskId)
        {
            var response = new Response<GetTaskOverviewDTO>();

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskOverviewDTO>("Invalid task id");

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