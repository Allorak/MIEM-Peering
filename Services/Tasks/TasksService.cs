using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Task;
using patools.Models;

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
            if(course == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-15, "Invalid course ID");
                return response;
            }

            if(course.Teacher.ID != teacherId)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(403, "This teacher has no access to the requested course");
                return response;
            }

            var newTask = new Models.Task();
            newTask.ID = Guid.NewGuid();
            newTask.Title = task.MainInfo.Title;
            newTask.Description = task.MainInfo.Description;
            newTask.Course = course;
            newTask.SubmissionStartDateTime = task.Settings.SubmissionStartDateTime;
            newTask.SubmissionEndDateTime = task.Settings.SubmissionEndDateTime;
            newTask.ReviewStartDateTime = task.Settings.ReviewStartDateTime;
            newTask.ReviewEndDateTime = task.Settings.ReviewEndDateTime;
            newTask.SubmissionsToCheck = task.Settings.SubmissionsToCheck;
            await _context.Tasks.AddAsync(newTask);
            await _context.SaveChangesAsync();


            foreach(var authorQuestion in task.AuthorForm.Rubrics)
            {
                var newAuthorQuestion = _mapper.Map<Question>(authorQuestion);
                System.Console.WriteLine(newAuthorQuestion.Title);
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

        public async System.Threading.Tasks.Task<Response<GetTaskOverviewDTO>> GetTaskOverview(Guid taskId)
        {
            var response = new Response<GetTaskOverviewDTO>();

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskId);
            if(task == null)
            {
                response.Success = false;
                response.Payload = null;
                response.Error = new Error(-15,"Task not found");
            }

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