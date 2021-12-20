using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Question;
using patools.Dtos.Task;
using patools.Models;
using patools.Errors;
namespace patools.Services.PeeringTasks
{
    public class PeeringTasksService : IPeeringTasksService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public PeeringTasksService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask)
        {

            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.ID == peeringTask.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid course id");

            if (course.Teacher.ID != peeringTask.TeacherId)
                return new NoAccessResponse<GetNewPeeringTaskDtoResponse>("This teacher has no access to this course");

            var newTask = new Models.PeeringTask
            {
                ID = Guid.NewGuid(),
                Title = peeringTask.MainInfo.Title,
                Description = peeringTask.MainInfo.Description,
                Course = course,
                SubmissionStartDateTime = peeringTask.Settings.SubmissionStartDateTime,
                SubmissionEndDateTime = peeringTask.Settings.SubmissionEndDateTime,
                ReviewStartDateTime = peeringTask.Settings.ReviewStartDateTime,
                ReviewEndDateTime = peeringTask.Settings.ReviewEndDateTime,
                SubmissionsToCheck = peeringTask.Settings.SubmissionsToCheck
            };
            await _context.Tasks.AddAsync(newTask);
            await _context.SaveChangesAsync();


            foreach(var authorQuestion in peeringTask.AuthorForm.Rubrics)
            {
                var newAuthorQuestion = _mapper.Map<Question>(authorQuestion);
                newAuthorQuestion.ID = Guid.NewGuid();
                newAuthorQuestion.PeeringTask = newTask;
                newAuthorQuestion.RespondentType = RespondentTypes.Author;
                await _context.Questions.AddAsync(newAuthorQuestion);
            }

            foreach(var peerQuestion in peeringTask.PeerForm.Rubrics)
            {
                var newPeerQuestion = _mapper.Map<Question>(peerQuestion);
                newPeerQuestion.ID = Guid.NewGuid();
                newPeerQuestion.PeeringTask = newTask;
                newPeerQuestion.RespondentType = RespondentTypes.Peer;
                await _context.Questions.AddAsync(newPeerQuestion);
            }

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<GetNewPeeringTaskDtoResponse>(_mapper.Map<GetNewPeeringTaskDtoResponse>(newTask));
        }

        public async Task<Response<List<GetPeeringTaskMainInfoDtoResponse>>> GetCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<List<GetPeeringTaskMainInfoDtoResponse>>("Invalid course id");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<List<GetPeeringTaskMainInfoDtoResponse>>("Invalid user id");

            var courseUserConnection = await _context.CourseUsers
                .FirstOrDefaultAsync(x => x.User == user && x.Course == course);

            SuccessfulResponse<List<GetPeeringTaskMainInfoDtoResponse>> response;
            if (courseInfo.UserRole == UserRoles.Teacher && course.Teacher != user)
                response = new SuccessfulResponse<List<GetPeeringTaskMainInfoDtoResponse>>(null);
            else if(courseInfo.UserRole == UserRoles.Student && courseUserConnection == null)
                response = new SuccessfulResponse<List<GetPeeringTaskMainInfoDtoResponse>>(null);
            else
            {
                var tasks = await _context.Tasks
                                    .Where(t => t.Course.ID == courseInfo.CourseId)
                                    .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                                    .ToListAsync();
                response = new SuccessfulResponse<List<GetPeeringTaskMainInfoDtoResponse>>(tasks);
            }
            return response;
        }

        public async System.Threading.Tasks.Task<Response<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview(Guid taskId, Guid teacherId)
        {

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == teacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPeeringTaskOverviewDtoResponse>("Invalid teacher id");

            var task = await _context.Tasks
                .Include(x => x.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskOverviewDtoResponse>("Invalid task id");

            if (task.Course.Teacher.ID != teacher.ID)
                return new NoAccessResponse<GetPeeringTaskOverviewDtoResponse>("This teacher has no access to this task");
            
            var totalAssignments = await _context.TaskUsers.CountAsync(tu => tu.PeeringTask == task);
            int submissionsNumber = 1;
            int reviewsNumber = 1;
            float[] grades = {10,10,10,10,10,10};

            var statistics = new GetPeeringTaskStatisticsDtoResponse
            {
                Submissions = submissionsNumber,
                Review = reviewsNumber,
                Total = totalAssignments
            };
            var deadlines = _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);

            return new SuccessfulResponse<GetPeeringTaskOverviewDtoResponse>
                (new GetPeeringTaskOverviewDtoResponse
                {
                    Statistics = statistics,
                    Deadlines = deadlines,
                    Grades = grades
                });
        }
        
        public async Task<Response<GetAuthorFormDTO>> GetAuthorForm(Guid taskId, Guid userId)
        {
            var response = new Response<GetAuthorFormDTO>();

            var task = await _context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetAuthorFormDTO>("Invalid task id");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                return new InvalidGuidIdResponse<GetAuthorFormDTO>("Invalid user id");

            if (user.Role == UserRoles.Student)
            {
                var taskUser =
                    await _context.TaskUsers.FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                if (taskUser == null)
                    return new NoAccessResponse<GetAuthorFormDTO>("This task is not assigned to this user");
            }
            else if (user.Role == UserRoles.Teacher)
            {
                if (task.Course.Teacher != user)
                    return new NoAccessResponse<GetAuthorFormDTO>("This teacher has no access to the task");
            }

            var questions = _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Author)
                .OrderBy(q => q.Order)
                .Select(q => _mapper.Map<GetQuestionDTO>(q));

            response.Success = true;
            response.Error = null;
            response.Payload = new GetAuthorFormDTO() {Rubrics = questions};
            return response;
        }
    }
}