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
            if (submission.Answers == null)
                return new BadRequestDataResponse<GetNewSubmissionDtoResponse>("Answers are not provided");
            
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
            if (taskUser.State != PeeringTaskStates.Assigned)
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
            taskUser.State = PeeringTaskStates.NotChecked;
            await _context.Submissions.AddAsync(newSubmission);

            var questions = await _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Author)
                .ToListAsync();
            var newAnswers = new List<Answer>();
            foreach (var answer in submission.Answers)
            {
                var question = questions.FirstOrDefault(q => q.ID == answer.QuestionId);
                
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
                        case QuestionTypes.Select when answer.Value<question.MinValue || answer.Value>question.MaxValue:
                            return new BadRequestDataResponse<GetNewSubmissionDtoResponse>(
                                "Answer for a select question is out of range");
                    }
                }
                newAnswers.Add(new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = newSubmission,
                    Question = question,
                    Response = answer.Response,
                    Value = answer.Value,
                    Review = null
                });

                questions.Remove(question);
            }

            var unansweredRequiredQuestionsAmount = questions.Where(q => q.Required).ToList().Count;
            if (unansweredRequiredQuestionsAmount > 0)
                return new BadRequestDataResponse<GetNewSubmissionDtoResponse>(
                    "There is no answer for a required question");
            
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

        public async Task<Response<GetSubmissionIdDtoResponse>> GetSubmissionIdForStudents(GetSubmissionIdDtoRequest taskInfo)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<GetSubmissionIdDtoResponse>("Invalid user id");

            var task = await _context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetSubmissionIdDtoResponse>("Invalid task id");

            var courseUser = await _context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.Course == task.Course && cu.User == student);
            if (courseUser == null)
                return new NoAccessResponse<GetSubmissionIdDtoResponse>("This student has no access to this course");
            
            var taskUser = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUser == null)
                return new NoAccessResponse<GetSubmissionIdDtoResponse>("The task isn't assigned to this user");

            if (task.SubmissionStartDateTime > DateTime.Now)
                return new OperationErrorResponse<GetSubmissionIdDtoResponse>("Submissioning hasn't started yet");

            var submission = await _context.Submissions
                .FirstOrDefaultAsync(x => x.PeeringTaskUserAssignment == taskUser);
            if (submission == null)
                return new OperationErrorResponse<GetSubmissionIdDtoResponse>("This student has no submission");
                
            return new SuccessfulResponse<GetSubmissionIdDtoResponse>(new GetSubmissionIdDtoResponse()
            {
                SubmissionId = submission.ID
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
                case {} when expert != null:
                    break;
                case UserRoles.Student:
                    if(submission.PeeringTaskUserAssignment.Student != user)
                        return new NoAccessResponse<GetSubmissionDtoResponse>("This submission doesn't belong to this user");
                    if(submission.PeeringTaskUserAssignment.State == PeeringTaskStates.Assigned)
                        return new OperationErrorResponse<GetSubmissionDtoResponse>("There is an error in stored data (TaskUsers table)");
                    break;
                case UserRoles.Teacher:
                    var task = await _context.Tasks
                        .Include(t => t.Course.Teacher)
                        .FirstOrDefaultAsync(t => t == submission.PeeringTaskUserAssignment.PeeringTask);

                    if (task.Course.Teacher != user)
                        return new NoAccessResponse<GetSubmissionDtoResponse>(
                            "This teacher has no access to this submission");
                    break;
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

        public async Task<Response<SubmissionStatus>> GetSubmissionStatus(CanSubmitDto submissionInfo)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == submissionInfo.StudentId && u.Role == UserRoles.Student);
            if (student == null)
                return new InvalidGuidIdResponse<SubmissionStatus>("Invalid student id provided");

            var task = await _context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == submissionInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<SubmissionStatus>("Invalid task id provided");

            var courseUser = await _context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.Course == task.Course && cu.User == student);
            if (courseUser == null)
                return new NoAccessResponse<SubmissionStatus>("This student has no access to this course");
            
            var taskUser = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUser == null)
                return new NoAccessResponse<SubmissionStatus>("This task is not assigned to this user");

            var submission = await _context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);

            return submission == null ? new SuccessfulResponse<SubmissionStatus>(SubmissionStatus.NotCompleted) : new SuccessfulResponse<SubmissionStatus>(SubmissionStatus.Completed);
        }
    }
}