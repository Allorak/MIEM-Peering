using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Review;
using patools.Enums;
using patools.Errors;
using patools.Models;

namespace patools.Services.Reviews
{
    public class ReviewsService : IReviewsService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public ReviewsService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        public async Task<Response<GetNewReviewDtoResponse>> AddReview(AddReviewDto review)
        {
            if (review.Answers == null)
                return new BadRequestDataResponse<GetNewReviewDtoResponse>("No answers provided");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == review.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetNewReviewDtoResponse>("Invalid user id provided");

            var submission = await _context.Submissions
                .Include(s => s.PeeringTaskUserAssignment.Student)
                .Include(s => s.PeeringTaskUserAssignment.PeeringTask)
                .FirstOrDefaultAsync(s => s.ID == review.SubmissionId);
            if (submission == null)
                return new InvalidGuidIdResponse<GetNewReviewDtoResponse>("Invalid submission id provided");

            var submissionPeerConnection = await _context.SubmissionPeers
                .FirstOrDefaultAsync(sp => sp.Peer == user && sp.Submission == submission);
            if (submissionPeerConnection == null)
                return new NoAccessResponse<GetNewReviewDtoResponse>("This user can't review this submission");
            
            var firstReview = await _context.Reviews.FirstOrDefaultAsync(r =>
                r.SubmissionPeerAssignment.Peer == user && r.SubmissionPeerAssignment.Submission == submission);
            if (firstReview != null)
                return new OperationErrorResponse<GetNewReviewDtoResponse>(
                    "This user has already reviewed this submission");
            
            var expert = await _context.Experts.FirstOrDefaultAsync(e =>
                e.User == user && e.PeeringTask == submission.PeeringTaskUserAssignment.PeeringTask);

            if (expert == null && user.Role == UserRoles.Student)
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
            await _context.Reviews.AddAsync(newReview);

            var questions = await _context.Questions
                .Where(q => q.PeeringTask == submission.PeeringTaskUserAssignment.PeeringTask &&
                            q.RespondentType == RespondentTypes.Peer)
                .ToListAsync();
            var answers = new List<Answer>();
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
                        case QuestionTypes.Select when answer.Value<question.MinValue || answer.Value>question.MaxValue:
                            return new BadRequestDataResponse<GetNewReviewDtoResponse>(
                                "Answer for a select question is out of range");
                    }
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
            
            await _context.Answers.AddRangeAsync(answers);
            await _context.SaveChangesAsync();

            return new SuccessfulResponse<GetNewReviewDtoResponse>(new GetNewReviewDtoResponse()
            {
                ReviewId = newReview.ID
            });
        }
    }
}