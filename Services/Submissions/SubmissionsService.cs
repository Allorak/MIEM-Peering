using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Submission;
using patools.Enums;
using patools.Errors;
using patools.Models;

namespace patools.Services.Submissions
{
    public class SubmissionsService : ISubmissionsService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public SubmissionsService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        public async Task<Response<GetNewSubmissionDtoResponse>> AddSubmission(AddSubmissionDto submission)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == submission.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<GetNewSubmissionDtoResponse>("Invalid user id");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == submission.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetNewSubmissionDtoResponse>("Invalid task id");
            
            var taskUser = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUser == null)
                return new InvalidGuidIdResponse<GetNewSubmissionDtoResponse>("The task isn't assigned to this user");
            if (taskUser.States != PeeringTaskStates.Assigned)
                return new OperationErrorResponse<GetNewSubmissionDtoResponse>("The submission for this task already exists");
            
            var newSubmission = new Submission()
            {
                ID = Guid.NewGuid(),
                PeeringTaskUserAssignment = taskUser
            };
            taskUser.States = PeeringTaskStates.Checking;
            await _context.Submissions.AddAsync(newSubmission);

            var newAnswers = new List<Answer>();
            foreach (var answer in submission.Answers)
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.PeeringTask == taskUser.PeeringTask && q.ID == answer.QuestionId);
                
                if (question == null)
                    return new BadRequestDataResponse<GetNewSubmissionDtoResponse>($"Incorrect QuestionId in answer");
                if (question.Required)
                {
                    switch (question.Type)
                    {
                        case QuestionTypes.Select or QuestionTypes.Multiple when answer.Value == null:
                            return new BadRequestDataResponse<GetNewSubmissionDtoResponse>(
                                "There is no answer for a required question");
                        case QuestionTypes.Text or QuestionTypes.ShortText when answer.Response == null:
                            return new BadRequestDataResponse<GetNewSubmissionDtoResponse>(
                                "There is no answer for a required question");
                    }
                }
                newAnswers.Add(new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = newSubmission,
                    Question = question,
                    Review = answer.Response,
                    Value = answer.Value
                });
            }
            await _context.Answers.AddRangeAsync(newAnswers);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<GetNewSubmissionDtoResponse>(newSubmission);
            return new SuccessfulResponse<GetNewSubmissionDtoResponse>(result);
        }

        public async Task<Response<GetAllSubmissionsMainInfoDtoResponse>> GetSubmissions(GetAllSubmissionsMainInfoDtoRequest taskInfo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetAllSubmissionsMainInfoDtoResponse>("Invalid user id");

            var task = await _context.Tasks
                .Include(t=> t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetAllSubmissionsMainInfoDtoResponse>("Invalid task id");

            if (user.Role == UserRoles.Teacher && task.Course.Teacher != user)
                return new NoAccessResponse<GetAllSubmissionsMainInfoDtoResponse>(
                    "The teacher has no access to this task");

            var submissions = await _context.Submissions
                .Where(s => s.PeeringTaskUserAssignment.PeeringTask == task)
                .Select(s => new GetSubmissionMainInfoDtoResponse()
                {
                    SubmissionId = s.ID,
                    StudentName = s.PeeringTaskUserAssignment.Student.Fullname
                })
                .ToListAsync();

            return new SuccessfulResponse<GetAllSubmissionsMainInfoDtoResponse>(
                new GetAllSubmissionsMainInfoDtoResponse()
                {
                    SubmissionsInfo = submissions
                });
        }
    }
}