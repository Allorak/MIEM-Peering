using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Question;
using patools.Dtos.Task;
using patools.Enums;
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

        public async Task<Response<GetPeeringTaskStudentOverviewDtoResponse>> GetTaskStudentOverview(GetPeeringTaskStudentOverviewRequest taskInfo)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.StudentId);
            if (student == null)
                return new InvalidGuidIdResponse<GetPeeringTaskStudentOverviewDtoResponse>("Invalid student id");

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskStudentOverviewDtoResponse>("Invalid task id");

            var taskUserConnection = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUserConnection == null)
                return new NoAccessResponse<GetPeeringTaskStudentOverviewDtoResponse>("This student has no access to this task");
            
            var deadlines = _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);
            
            var reviewed = 0;
            
            return new SuccessfulResponse<GetPeeringTaskStudentOverviewDtoResponse>
            (new GetPeeringTaskStudentOverviewDtoResponse
            {
                Deadlines = deadlines,
                SubmissionsToCheck = task.SubmissionsToCheck,
                Reviewed = reviewed
            });
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

            var newTask = new PeeringTask
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
                if (!newPeerQuestion.Required)
                    newPeerQuestion.CoefficientPercentage = null;
                await _context.Questions.AddAsync(newPeerQuestion);
            }

            switch (peeringTask.StepParams)
            {
                case null:
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Task step is not defined");
                case {Step: PeeringSteps.FirstStep, Experts: null}:
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Experts required but no info provided");
                case {Step: PeeringSteps.FirstStep}:
                {
                    newTask.Step = PeeringSteps.FirstStep;
                    foreach (var email in peeringTask.StepParams.Experts)
                    {
                        var expertUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                        var expert = new Expert()
                        {
                            ID = Guid.NewGuid(),
                            Email = email,
                            User = expertUser,
                            PeeringTask = newTask
                        };

                        await _context.Experts.AddAsync(expert);
                    }

                    break;
                }
                case {Step: PeeringSteps.SecondStep, TaskId: null}:
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("No expert task id provided");
                case {Step: PeeringSteps.SecondStep}:
                    newTask.Step = PeeringSteps.SecondStep;
                    var expertTask = await _context.Tasks
                        .FirstOrDefaultAsync(t => t.ID == peeringTask.StepParams.TaskId);
                    if (expertTask == null)
                        return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid expert task id provided");
                    newTask.ExpertTask = expertTask;
                    break;
            }

            await _context.SaveChangesAsync();

            return new SuccessfulResponse<GetNewPeeringTaskDtoResponse>(_mapper.Map<GetNewPeeringTaskDtoResponse>(newTask));
        }

        public async Task<Response<GetCourseTasksDtoResponse>> GetTeacherCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            
            var teacher = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid teacher id");
           
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var expert = await _context.Experts.FirstOrDefaultAsync(x => x.User == teacher && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            if(course.Teacher != teacher)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This teacher has no access to the course");

            var tasks = await _context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                .ToListAsync();
        
            return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
            {
                Tasks = tasks
            });

        }
        
        public async Task<Response<GetCourseTasksDtoResponse>> GetStudentCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var student = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid user id");

            var expert = await _context.Experts.FirstOrDefaultAsync(x => x.User == student && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            
            var courseUserConnection = await _context.CourseUsers
                .FirstOrDefaultAsync(x => x.User == student && x.Course == course);
        
            if (courseUserConnection == null)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This user is not assigned to this course");
            
            var tasks = await _context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                .ToListAsync();

            return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
            {
                Tasks = tasks
            });

        }

        public async Task<List<GetPeeringTaskMainInfoDtoResponse>> GetExpertCourseTasks(Expert expert, Course course)
        {
            var tasks = new List<GetPeeringTaskMainInfoDtoResponse>();
            if(expert!=null)
                tasks.AddRange(await _context.Experts
                    .Where(x => x == expert && x.PeeringTask.Course == course)
                    .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x.PeeringTask))
                    .ToListAsync());
            return tasks;
        }

        public async Task<Response<GetPeeringTaskTeacherOverviewDtoResponse>> GetTaskTeacherOverview(GetPeeringTaskTeacherOverviewDtoRequest taskInfo)
        {

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.TeacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid teacher id");

            var task = await _context.Tasks
                .Include(x => x.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid task id");

            if (task.Course.Teacher.ID != teacher.ID)
                return new NoAccessResponse<GetPeeringTaskTeacherOverviewDtoResponse>("This teacher has no access to this task");
            
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

            return new SuccessfulResponse<GetPeeringTaskTeacherOverviewDtoResponse>
                (new GetPeeringTaskTeacherOverviewDtoResponse
                {
                    Statistics = statistics,
                    Deadlines = deadlines,
                    Grades = grades
                });
        }
        
        public async Task<Response<GetAuthorFormDtoResponse>> GetAuthorForm(GetAuthorFormDtoRequest taskInfo)
        {
            var response = new Response<GetAuthorFormDtoResponse>();

            var task = await _context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid task id");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid user id");

            if (user.Role == UserRoles.Student)
            {
                var taskUser =
                    await _context.TaskUsers.FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                if (taskUser == null)
                    return new NoAccessResponse<GetAuthorFormDtoResponse>("This task is not assigned to this user");
            }
            else if (user.Role == UserRoles.Teacher)
            {
                if (task.Course.Teacher != user)
                    return new NoAccessResponse<GetAuthorFormDtoResponse>("This teacher has no access to the task");
            }

            var questions = _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Author)
                .OrderBy(q => q.Order)
                .Select(q => _mapper.Map<GetQuestionDto>(q));

            response.Success = true;
            response.Error = null;
            response.Payload = new GetAuthorFormDtoResponse() {Rubrics = questions};
            return response;
        }
    }
}