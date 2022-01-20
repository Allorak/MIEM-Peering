using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Answer;
using patools.Dtos.Submission;
using patools.Dtos.SubmissionPeer;
using patools.Dtos.Task;
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
                .OrderBy(s => s.StudentName)
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
                .Include(s => s.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == submissionInfo.SubmissionId);
            if (submission == null)
                return new InvalidGuidIdResponse<GetSubmissionDtoResponse>("Invalid submission id provided");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == submissionInfo.StudentId);
            if (user == null)
                return new InvalidGuidIdResponse<GetSubmissionDtoResponse>("Invalid student id provided");

            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t == submission.PeeringTaskUserAssignment.PeeringTask);
            
            var submissionPeer = await _context.SubmissionPeers
                .FirstOrDefaultAsync(sp => sp.Submission == submission && sp.Peer == user);
            
            if (submissionPeer == null && submission.PeeringTaskUserAssignment.Student != user && task.Course.Teacher != user)
                return new NoAccessResponse<GetSubmissionDtoResponse>("This user can't access this submission");


            return new SuccessfulResponse<GetSubmissionDtoResponse>(new GetSubmissionDtoResponse()
            {
                Answers = await GetResponses(review:null,submission:submission)
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

        public async Task<Response<IEnumerable<GetSubmissionToCheckDtoResponse>>> GetChecksCatalog(GetSubmissionToCheckDtoRequest taskInfo)
        {
            var task = await _context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>("Invalid task id provided");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>("Invalid user id provided");

            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);

            var submissionPeers = await _context.SubmissionPeers
                .Include(sp => sp.Submission)
                .Include(sp => sp.Submission.PeeringTaskUserAssignment.Student)
                .Where(sp => sp.Peer == user && sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
            
            var reviewedSubmissionPeers = await _context.Reviews
                .Select(r => r.SubmissionPeerAssignment)
                .Where(sp => sp.Peer == user &&
                            sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
            
            var uncheckedSubmissions = submissionPeers
                .Where(sp => !reviewedSubmissionPeers.Contains(sp))
                .Select(sp => new GetSubmissionToCheckDtoResponse()
                {
                    SubmissionId = sp.Submission.ID,
                    StudentName = sp.Submission.PeeringTaskUserAssignment.Student.Fullname
                })
                .ToList();
            
            switch (user.Role)
            {
                case {} when expert != null:
                    break;
                case UserRoles.Student:
                    var courseUser = await _context.CourseUsers.FirstOrDefaultAsync(cu =>
                        cu.User == user && cu.Course == task.Course);
                    if (courseUser == null)
                        return new NoAccessResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                            "This user is not assigned to this course");
                    
                    var taskUser = await _context.TaskUsers.FirstOrDefaultAsync(tu =>
                            tu.Student == user && tu.PeeringTask == task);
                    if (taskUser == null)
                        return new NoAccessResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                            " This user is not assigned to this task");

                    if (taskUser.State == PeeringTaskStates.Assigned)
                        return new OperationErrorResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                            "This student hasn't submissioned yet");

                    var submission =  await _context.Submissions
                        .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
                    if (submission == null)
                        return new OperationErrorResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                            "There is an error in database");

                    if (task.ReviewType == ReviewTypes.DoubleBlind)
                    {
                        var index = 1;
                        foreach (var submissionToCheck in uncheckedSubmissions)
                        {
                            submissionToCheck.StudentName = $"Аноним #{index++}";
                        }
                    }
                    break;
                case UserRoles.Teacher:
                    if (task.Course.Teacher != user)
                        return new NoAccessResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                            "This teacher has no access to this course");
                    break;
                default:
                    return new OperationErrorResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(
                        "Incorrect user role in token");
            }

            return new SuccessfulResponse<IEnumerable<GetSubmissionToCheckDtoResponse>>(uncheckedSubmissions);
        }

        public async Task<Response<GetSubmissionMetadataDtoResponse>> GetSubmissionMetadata(GetSubmissionMetadataDtoRequest submissionInfo)
        {
            var submission = await _context.Submissions
                .Include(s =>s.PeeringTaskUserAssignment.PeeringTask.Course.Teacher)
                .Include(s =>s.PeeringTaskUserAssignment.PeeringTask.Course)
                .Include(s =>s.PeeringTaskUserAssignment.PeeringTask)
                .FirstOrDefaultAsync(s => s.ID == submissionInfo.SubmissionId);
            if (submission == null)
                return new InvalidGuidIdResponse<GetSubmissionMetadataDtoResponse>("Invalid submission id provided");

            var teacher = await _context.Users.FirstOrDefaultAsync(u =>
                    u.ID == submissionInfo.TeacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetSubmissionMetadataDtoResponse>("Invalid student id provided");

            if (submission.PeeringTaskUserAssignment.PeeringTask.Course.Teacher != teacher)
                return new NoAccessResponse<GetSubmissionMetadataDtoResponse>("This teacher has no access to this task ");

            var submissionPeers = await _context.SubmissionPeers
                .Where(sp => sp.Submission == submission)
                .ToListAsync();

            var reviews = await _context.Reviews
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Where(r => submissionPeers.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();

            var resultStatistics = new List<GetStatisticDtoResponse>();
            
            var questions = await _context.Questions
                .Where(q => q.PeeringTask == submission.PeeringTaskUserAssignment.PeeringTask
                            && q.Type == QuestionTypes.Select && q.RespondentType == RespondentTypes.Peer)
                .ToListAsync();

            resultStatistics.Add(await GetFinalGradesStatistic(reviews));
            
            foreach (var question in questions)
                resultStatistics.Add(await GetCriteriaStatistic(question,reviews));

            foreach (var review in reviews)
                resultStatistics.Add(await GetReviewerStatistic(review));
            
            return new SuccessfulResponse<GetSubmissionMetadataDtoResponse>(new GetSubmissionMetadataDtoResponse()
            {
                Statistics = resultStatistics
            });
        }

        private async Task<GetStatisticDtoResponse> GetFinalGradesStatistic(IEnumerable<Review> reviews)
        { 
            return new GetStatisticDtoResponse()
            {
                StatisticType = StatisticTypes.Graph,
                GraphType = GraphTypes.FinalGrades,
                MinGrade = 0,
                MaxGrade = 10,
                Coordinates = await GetGraphCoordinates(reviews)
            };
        }
        private async Task<IEnumerable<GetPeeringTaskCoordinatesDtoResponse>> GetGraphCoordinates(IEnumerable<Review> reviews,Question question = null)
        {
            var coordinates = new List<GetPeeringTaskCoordinatesDtoResponse>();
            
            foreach (var review in reviews)
            {
                var coordinate = new GetPeeringTaskCoordinatesDtoResponse
                {
                    Name = review.SubmissionPeerAssignment.Peer.Fullname,
                    Reviewer = await GetReviewerType(review)
                };
                if (question != null)
                {
                    var answer = await _context.Answers
                        .FirstOrDefaultAsync(a=>a.Question == question && a.Review == review);
                    if(answer.Value!=null)
                        coordinate.Value = answer.Value.Value;
                }
                else
                {
                    coordinate.Value = review.Grade;
                }
                coordinates.Add(coordinate);
            }

            return coordinates;
        }
        private async Task<ReviewerTypes> GetReviewerType(Review review)
        {
            var submission = review.SubmissionPeerAssignment.Submission;
            var task = submission.PeeringTaskUserAssignment.PeeringTask;
            var peer = review.SubmissionPeerAssignment.Peer;
            var teacher = task.Course.Teacher;
            
            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == peer && e.PeeringTask == task);
            
            if (expert != null) return ReviewerTypes.Expert;
            return teacher == peer ? ReviewerTypes.Teacher : ReviewerTypes.Peer;
        }
        private async Task<GetStatisticDtoResponse> GetCriteriaStatistic(Question question, IEnumerable<Review> reviews)
        {
            return new GetStatisticDtoResponse()
            {
                StatisticType = StatisticTypes.Graph,
                GraphType = GraphTypes.Criteria,
                Title = question.Title,
                MinGrade = question.MinValue,
                MaxGrade = question.MaxValue,
                Coordinates = await GetGraphCoordinates(reviews,question),
                Responses = null
            };
        }
        private async Task<GetStatisticDtoResponse> GetReviewerStatistic(Review review)
        {
            return new GetStatisticDtoResponse()
            {
                StatisticType = StatisticTypes.Response,
                Name = review.SubmissionPeerAssignment.Peer.Fullname,
                Reviewer = await GetReviewerType(review),
                Responses = await GetResponses(review:review, submission:null)
            };
        }
        private async Task<IEnumerable<GetAnswerDtoResponse>> GetResponses(Review review, Submission submission)
        {
            var answers = await _context.Answers
                .Include(a => a.Question)
                .Where(a => 
                    a.Review == review && a.Submission == submission && a.Question.RespondentType == RespondentTypes.Peer)
                .ToListAsync();

            var resultAnswers = new List<GetAnswerDtoResponse>();
            foreach (var answer in answers)
            {
                var resultAnswer = _mapper.Map<GetAnswerDtoResponse>(answer.Question);
                resultAnswer.QuestionId = answer.Question.ID;
                resultAnswer.Value = answer.Value;
                resultAnswer.Response = answer.Response;
                resultAnswer.Responses = await GetVariants(answer.Question);
                resultAnswers.Add(resultAnswer);
            }

            return resultAnswers;
        }
        private async Task<IEnumerable<GetVariantDtoResponse>> GetVariants(Question question)
        {
            return await _context.Variants
                .Where(v => v.Question == question)
                .Select(v => new GetVariantDtoResponse()
                {
                    Id=v.ChoiceId,
                    Response = v.Response
                })
                .OrderBy(v=>v.Id)
                .ToListAsync();
        }
    }
}