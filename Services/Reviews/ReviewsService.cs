using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGeneration.DotNet;
using patools.Dtos.Answer;
using patools.Dtos.Review;
using patools.Dtos.Task;
using patools.Dtos.Variants;
using patools.Enums;
using patools.Errors;
using patools.Models;
using patools.Services.PeeringTasks;

namespace patools.Services.Reviews
{
    public class ReviewsService : ServiceBase,IReviewsService
    {
        private readonly IPeeringTasksService _peeringTasksService;

        public ReviewsService(PAToolsContext context, IMapper mapper, IPeeringTasksService peeringTasksService) : base (context, mapper)
        {
            _peeringTasksService = peeringTasksService;
        }

        public async Task<Response<GetNewReviewDtoResponse>> AddReview(AddReviewDto review)
        {
            if (review.Answers == null)
                return new BadRequestDataResponse<GetNewReviewDtoResponse>("No answers provided");

            var peer = await GetUserById(review.UserId);
            if (peer == null)
                return new InvalidGuidIdResponse<GetNewReviewDtoResponse>("Invalid user id provided");

            var submission = await GetSubmissionById(review.SubmissionId);
            if (submission == null)
                return new InvalidGuidIdResponse<GetNewReviewDtoResponse>("Invalid submission id provided");

            var task = submission.PeeringTaskUserAssignment.PeeringTask;
            
            var submissionPeerConnection = await GetSubmissionPeer(submission, peer);
            if (submissionPeerConnection == null)
                return new NoAccessResponse<GetNewReviewDtoResponse>("This user can't review this submission");

            var firstReview = await GetReview(submissionPeerConnection);
            if (firstReview != null)
                return new OperationErrorResponse<GetNewReviewDtoResponse>(
                    "This user has already reviewed this submission");

            if (await IsExpertUser(peer, task) == false && peer.Role == UserRoles.Student)
            {
                if (submission.PeeringTaskUserAssignment.PeeringTask.ReviewStartDateTime > DateTime.Now)
                    return new OperationErrorResponse<GetNewReviewDtoResponse>("Reviewing hasn't started yet");
                if (submission.PeeringTaskUserAssignment.PeeringTask.ReviewEndDateTime < DateTime.Now)
                    return new OperationErrorResponse<GetNewReviewDtoResponse>("The deadline has already passed");
            }

            var newReview = new Review()
            {
                ID = Guid.NewGuid(),
                SubmissionPeerAssignment = submissionPeerConnection
            };
            submission.PeeringTaskUserAssignment.State = PeeringTaskStates.Checked;
            await Context.Reviews.AddAsync(newReview);

            var questions = await GetPeerQuestions(task);
            var answers = new List<Answer>();
            var grades = new List<float>();
            foreach (var answer in review.Answers)
            {
                var question = questions.FirstOrDefault(q => q.ID == answer.QuestionId);

                if (question == null)
                    return new BadRequestDataResponse<GetNewReviewDtoResponse>($"Incorrect QuestionId in answer");
                if (question.Required)
                {
                    switch (question.Type)
                    {
                        case QuestionTypes.Select or QuestionTypes.Multiple when answer.Value == null:
                            return new BadRequestDataResponse<GetNewReviewDtoResponse>(
                                "There is no answer for a required question");
                        case QuestionTypes.Text or QuestionTypes.ShortText when answer.Response == null:
                            return new BadRequestDataResponse<GetNewReviewDtoResponse>(
                                "There is no answer for a required question");
                        case QuestionTypes.Select
                            when answer.Value < question.MinValue || answer.Value > question.MaxValue:
                            return new BadRequestDataResponse<GetNewReviewDtoResponse>(
                                "Answer for a select question is out of range");
                    }
                }

                if (question.Type == QuestionTypes.Select)
                {
                    const int maxGrade = 10;
                    var mappedValue = answer.Value * 1f / (question.MaxValue - question.MinValue) * maxGrade;
                    if (mappedValue == null)
                        return new OperationErrorResponse<GetNewReviewDtoResponse>(
                            "There is an error in database (Min or Max value for select-type question is null)");
                    var weightedValue = mappedValue.Value * question.CoefficientPercentage / 100;
                    if (weightedValue == null)
                        return new OperationErrorResponse<GetNewReviewDtoResponse>(
                            "there is an error in database (Coefficient Percentage for required select question is null)");
                    grades.Add(weightedValue.Value);
                }

                answers.Add(new Answer()
                {
                    ID = Guid.NewGuid(),
                    Review = newReview,
                    Question = question,
                    Response = answer.Response,
                    Value = answer.Value,
                    Submission = null
                });

                questions.Remove(question);
            }

            var unansweredRequiredQuestionsAmount = questions.Where(q => q.Required).ToList().Count;
            if (unansweredRequiredQuestionsAmount > 0)
                return new BadRequestDataResponse<GetNewReviewDtoResponse>(
                    "There is no answer for a required question");

            if (grades.Count == 0)
                return new OperationErrorResponse<GetNewReviewDtoResponse>("There were no select-questions");

            var resultGrade = grades.Sum();
            newReview.Grade = resultGrade;

            await Context.Answers.AddRangeAsync(answers);

            if (DateTime.Now > task.ReviewEndDateTime)
            {
                await _peeringTasksService.ChangeConfidenceFactors(new ChangeConfidenceFactorDto()
                {
                    TaskId = task.ID
                });
            }

            await Context.SaveChangesAsync();

            return new SuccessfulResponse<GetNewReviewDtoResponse>(new GetNewReviewDtoResponse()
            {
                ReviewId = newReview.ID
            });
        }

        public async Task<Response<IEnumerable<GetReviewDtoResponse>>> GetAllReviews(GetReviewDtoRequest taskInfo)
        {
            var student = await Context.Users.FirstOrDefaultAsync(
                u => u.ID == taskInfo.StudentId && u.Role == UserRoles.Student);
            if (student == null)
                return new InvalidGuidIdResponse<IEnumerable<GetReviewDtoResponse>>("Invalid user id provided");

            var task = await Context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<IEnumerable<GetReviewDtoResponse>>("Invalid task id provided");

            var courseUser = await Context.CourseUsers
                .FirstOrDefaultAsync(cu => cu.Course == task.Course && cu.User == student);
            if (courseUser == null)
                return new NoAccessResponse<IEnumerable<GetReviewDtoResponse>>(
                    "This user is not assigned to this course");

            var taskUser = await Context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUser == null)
                return new NoAccessResponse<IEnumerable<GetReviewDtoResponse>>("This user has no access to this task");

            var submission =
                await Context.Submissions.FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
            if (submission == null)
                return new OperationErrorResponse<IEnumerable<GetReviewDtoResponse>>(
                    "This user hasn't submissioned yet");

            var reviews = await Context.Reviews
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student == student)
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();

            var resultReviews = new List<GetReviewDtoResponse>();
            var index = 0;
            foreach (var review in reviews)
            {
                var peer = review.SubmissionPeerAssignment.Peer;

                var expert = await Context.Experts.FirstOrDefaultAsync(
                    e => e.User == peer &&
                         e.PeeringTask == task);

                var resultReview = new GetReviewDtoResponse();
                resultReview.ReviewerName = peer.Fullname;
                switch (peer.Role)
                {
                    case { } when expert != null:
                        resultReview.Reviewer = ReviewerTypes.Expert;
                        resultReview.ReviewerName = "Эксперт";
                        break;
                    case UserRoles.Student:
                        resultReview.Reviewer = ReviewerTypes.Peer;
                        if (task.ReviewType != ReviewTypes.Open)
                            resultReview.ReviewerName = $"Аноним #{index++}";
                        break;
                    case UserRoles.Teacher:
                        resultReview.Reviewer = ReviewerTypes.Teacher;
                        break;
                    default:
                        return new OperationErrorResponse<IEnumerable<GetReviewDtoResponse>>(
                            "There is an error in database");
                }

                resultReview.ReviewId = review.ID;
                resultReview.FinalGrade = review.Grade;

                var answers = await Context.Answers
                    .Include(a => a.Question)
                    .Where(a => a.Review == review)
                    .ToListAsync();

                var resultAnswers = new List<GetAnswerDtoResponse>();
                foreach (var answer in answers)
                {
                    var question = await Context.Questions.FirstOrDefaultAsync(q => q == answer.Question);
                    if (question == null)
                        return new OperationErrorResponse<IEnumerable<GetReviewDtoResponse>>(
                            "There is an error in stored data (Questions table)");

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
                            resultAnswer.CoefficientPercentage = answer.Question.CoefficientPercentage;
                            break;
                        case QuestionTypes.Multiple:
                            resultAnswer.Value = answer.Value;
                            var responses = await Context.Variants
                                .Where(v => v.Question == question)
                                .Select(v => new GetVariantDtoResponse()
                                {
                                    Id = v.ChoiceId,
                                    Response = v.Response
                                })
                                .OrderBy(v => v.Id)
                                .ToListAsync();
                            resultAnswer.Responses = responses;
                            break;
                    }

                    resultAnswers.Add(resultAnswer);
                }

                resultReview.Answers = resultAnswers;
                resultReviews.Add(resultReview);
            }

            return new SuccessfulResponse<IEnumerable<GetReviewDtoResponse>>(resultReviews);
        }

        public async Task<Response<IEnumerable<GetMyReviewDtoResponse>>> GetAllMyReviews(GetMyReviewDtoRequest taskInfo)
        {
            var user = await Context.Users.FirstOrDefaultAsync(
                u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<IEnumerable<GetMyReviewDtoResponse>>("Invalid user id provided");

            var task = await Context.Tasks
                .Include(t => t.Course)
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<IEnumerable<GetMyReviewDtoResponse>>("Invalid task id provided");

            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);

            switch (user.Role)
            {
                case { } when expert != null:
                    return new NoAccessResponse<IEnumerable<GetMyReviewDtoResponse>>("Expert can't make this request");
                case UserRoles.Student:
                    var courseUser = await Context.CourseUsers
                        .FirstOrDefaultAsync(cu => cu.Course == task.Course && cu.User == user);
                    if (courseUser == null)
                        return new NoAccessResponse<IEnumerable<GetMyReviewDtoResponse>>(
                            "This user is not assigned to this course");

                    var taskUser = await Context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (taskUser == null)
                        return new NoAccessResponse<IEnumerable<GetMyReviewDtoResponse>>(
                            "This user has no access to this task");
                    break;
                case UserRoles.Teacher:
                    return new NoAccessResponse<IEnumerable<GetMyReviewDtoResponse>>("Teacher can't make this request");
                default:
                    return new BadRequestDataResponse<IEnumerable<GetMyReviewDtoResponse>>(
                        "Incorrect role stored in token");
            }

            var resultReviews = new List<GetMyReviewDtoResponse>();
            var reviews = await Context.Reviews
                .Where(r => r.SubmissionPeerAssignment.Peer == user &&
                            r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask)
                .ToListAsync();
            var index = 0;
            foreach (var review in reviews)
            {
                var submission = review.SubmissionPeerAssignment.Submission;
                var student = submission.PeeringTaskUserAssignment.Student;
                var resultReview = new GetMyReviewDtoResponse()
                {
                    SubmissionId = submission.ID,
                    StudentName = task.ReviewType == ReviewTypes.DoubleBlind ? $"Аноним #{++index}" : student.Fullname
                };

                var teacherReview = await Context.Reviews
                    .FirstOrDefaultAsync(r => r.SubmissionPeerAssignment.Peer == task.Course.Teacher &&
                                              r.SubmissionPeerAssignment.Submission == submission);

                if (teacherReview != null)
                    resultReview.TeacherAnswers = await GetAnswersForReview(teacherReview);
                else if (task.TaskType == TaskTypes.Initial)
                {
                    var experts = await Context.Experts
                        .Where(e => e.PeeringTask == task)
                        .Select(e => e.User)
                        .ToListAsync();
                    var expertReview = await Context.Reviews
                        .FirstOrDefaultAsync(r =>
                            r.SubmissionPeerAssignment.Submission == review.SubmissionPeerAssignment.Submission
                            && experts.Contains(r.SubmissionPeerAssignment.Peer));

                    if (expertReview != null)
                        resultReview.ExpertAnswers = await GetAnswersForReview(expertReview);
                }
                
                resultReview.Answers = await GetAnswersForReview(review);
                resultReviews.Add(resultReview);
            }

            return new SuccessfulResponse<IEnumerable<GetMyReviewDtoResponse>>(resultReviews);
        }

        private async Task<IEnumerable<GetAnswerDtoResponse>> GetAnswersForReview(Review review)
        {
            
                var answers = await Context.Answers
                    .Include(a => a.Question)
                    .Where(a => a.Review == review)
                    .ToListAsync();

                var resultAnswers = new List<GetAnswerDtoResponse>();
                foreach (var answer in answers)
                {
                    var question = await Context.Questions.FirstOrDefaultAsync(q => q == answer.Question);

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
                            resultAnswer.CoefficientPercentage = answer.Question.CoefficientPercentage;
                            break;
                        case QuestionTypes.Multiple:
                            resultAnswer.Value = answer.Value;
                            var responses = await Context.Variants
                                .Where(v => v.Question == question)
                                .Select(v => new GetVariantDtoResponse()
                                {
                                    Id = v.ChoiceId,
                                    Response = v.Response
                                })
                                .OrderBy(v => v.Id)
                                .ToListAsync();
                            resultAnswer.Responses = responses;
                            break;
                    }

                    resultAnswers.Add(resultAnswer);
                }
                return resultAnswers;
        }
    }
}
