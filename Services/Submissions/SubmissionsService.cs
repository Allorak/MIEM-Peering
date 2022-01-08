using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Answer;
using patools.Dtos.Submission;
using patools.Dtos.SubmissionPeer;
using patools.Dtos.Variants;
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
            
            if (task.SubmissionEndDateTime < DateTime.Now)
                return new OperationErrorResponse<GetNewSubmissionDtoResponse>("The deadline has already passed");
            if (task.SubmissionStartDateTime > DateTime.Now)
                return new OperationErrorResponse<GetNewSubmissionDtoResponse>("Submissioning hasn't started yet");

            
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
                    Response = answer.Response,
                    Value = answer.Value
                });
            }
            await _context.Answers.AddRangeAsync(newAnswers);
            await _context.SaveChangesAsync();
            var result = new GetNewSubmissionDtoResponse()
            {
                SubmissionId = newSubmission.ID
            };
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

        public async Task<Response<GetSubmissionDtoResponse>> GetSubmission(GetSubmissionDtoRequest submissionInfo)
        {
            var submission = await _context.Submissions
                .Include(s => s.PeeringTaskUserAssignment)
                .Include(s => s.PeeringTaskUserAssignment.Student)
                .Include(s => s.PeeringTaskUserAssignment.PeeringTask)
                .FirstOrDefaultAsync(t => t.ID == submissionInfo.SubmissionId);
            if (submission == null)
                return new InvalidGuidIdResponse<GetSubmissionDtoResponse>("Invalid submission id provided");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == submissionInfo.StudentId);
            if (user == null)
                return new InvalidGuidIdResponse<GetSubmissionDtoResponse>("Invalid student id provided");

            var expert = await _context.Experts.FirstOrDefaultAsync(e =>
                e.User == user && e.PeeringTask == submission.PeeringTaskUserAssignment.PeeringTask);
            
            switch (user.Role)
            {
                case UserRoles.Student when submission.PeeringTaskUserAssignment.Student != user && expert == null:
                    return new NoAccessResponse<GetSubmissionDtoResponse>("This submission doesn't belong to this user");
                case UserRoles.Student when submission.PeeringTaskUserAssignment.States == PeeringTaskStates.Assigned:
                    return new OperationErrorResponse<GetSubmissionDtoResponse>("There is an error in stored data (TaskUsers table)");
                case UserRoles.Teacher when expert == null:
                {
                    var task = await _context.Tasks
                        .Include(t => t.Course.Teacher)
                        .FirstOrDefaultAsync(t => t == submission.PeeringTaskUserAssignment.PeeringTask);

                    if (task.Course.Teacher != user)
                        return new NoAccessResponse<GetSubmissionDtoResponse>(
                            "This teacher has no access to this submission");
                    break;
                }
                default:
                    return new OperationErrorResponse<GetSubmissionDtoResponse>("Incorrect user role in token");
            }

            var answers = await _context.Answers
                .Include(a => a.Question)
                .Where(a => a.Submission == submission)
                .ToListAsync();

            var resultAnswers = new List<GetAnswerDtoResponse>();
            foreach (var answer in answers)
            {
                var question = await _context.Questions.FirstOrDefaultAsync(q => q == answer.Question);
                if(question==null)
                    return new OperationErrorResponse<GetSubmissionDtoResponse>("There is an error in stored data (Questions table)");
                
                var resultAnswer = new GetAnswerDtoResponse()
                {
                    QuestionId = question.ID,
                    Order = question.Order,
                    Title = question.Title,
                    Description = question.Description,
                    MinValue = question.MinValue,
                    MaxValue = question.MaxValue,
                    Required = question.Required,
                    Type = question.Type
                };
                switch (resultAnswer.Type)
                {
                    case QuestionTypes.Text or QuestionTypes.ShortText:
                        resultAnswer.Response = answer.Response;
                        break;
                    case QuestionTypes.Select:
                        resultAnswer.Value = answer.Value;
                        break;
                    case QuestionTypes.Multiple:
                        resultAnswer.Value = answer.Value;
                        var responses = await _context.Variants
                            .Where(v => v.Question == question)
                            .Select(v => new GetVariantDtoResponse()
                            {
                                Id=v.ChoiceId,
                                Response = v.Response
                            })
                            .OrderBy(v=>v.Id)
                            .ToListAsync();
                        resultAnswer.Responses = responses;
                        break;
                }
                resultAnswers.Add(resultAnswer);
            }

            return new SuccessfulResponse<GetSubmissionDtoResponse>(new GetSubmissionDtoResponse()
            {
                Answers = resultAnswers
            });
        }
        
        
    }
}