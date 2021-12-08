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

        public async Task<Response<GetNewTaskDtoResponse>> AddTask(AddTaskDto task)
        {

            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.ID == task.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetNewTaskDtoResponse>("Invalid course id");

            if (course.Teacher.ID != task.TeacherId)
                return new NoAccessResponse<GetNewTaskDtoResponse>("This teacher has no access to this course");

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

            return new SuccessfulResponse<GetNewTaskDtoResponse>(_mapper.Map<GetNewTaskDtoResponse>(newTask));
        }

        public async Task<Response<List<GetTaskMainInfoDtoResponse>>> GetCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<List<GetTaskMainInfoDtoResponse>>("Invalid course id");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<List<GetTaskMainInfoDtoResponse>>("Invalid user id");

            var courseUserConnection = await _context.CourseUsers
                .FirstOrDefaultAsync(x => x.User == user && x.Course == course);

            SuccessfulResponse<List<GetTaskMainInfoDtoResponse>> response;
            if (courseInfo.UserRole == UserRoles.Teacher && course.Teacher != user)
                response = new SuccessfulResponse<List<GetTaskMainInfoDtoResponse>>(null);
            else if(courseInfo.UserRole == UserRoles.Student && courseUserConnection == null)
                response = new SuccessfulResponse<List<GetTaskMainInfoDtoResponse>>(null);
            else
            {
                var tasks = await _context.Tasks
                                    .Where(t => t.Course.ID == courseInfo.CourseId)
                                    .Select(x => _mapper.Map<GetTaskMainInfoDtoResponse>(x))
                                    .ToListAsync();
                response = new SuccessfulResponse<List<GetTaskMainInfoDtoResponse>>(tasks);
            }
            return response;
        }

        public async System.Threading.Tasks.Task<Response<GetTaskOverviewDtoResponse>> GetTaskOverview(Guid taskId, Guid teacherId)
        {

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == teacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetTaskOverviewDtoResponse>("Invalid teacher id");

            var task = await _context.Tasks
                .Include(x => x.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskOverviewDtoResponse>("Invalid task id");

            if (task.Course.Teacher.ID != teacher.ID)
                return new NoAccessResponse<GetTaskOverviewDtoResponse>("This teacher has no access to this task");
            
            var totalAssignments = await _context.TaskUsers.CountAsync(tu => tu.Task == task);
            int submissionsNumber = 1;
            int reviewsNumber = 1;
            float[] grades = {10,10,10,10,10,10};

            var statistics = new GetTaskStatisticsDtoResponse
            {
                Submissions = submissionsNumber,
                Review = reviewsNumber,
                Total = totalAssignments
            };
            var deadlines = _mapper.Map<GetTaskDeadlinesDtoResponse>(task);

            return new SuccessfulResponse<GetTaskOverviewDtoResponse>
                (new GetTaskOverviewDtoResponse
                {
                    Statistics = statistics,
                    Deadlines = deadlines,
                    Grades = grades
                });
        }
    }
}