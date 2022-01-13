using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Review;
using patools.Enums;
using patools.Errors;
using patools.Models;
using patools.Services.Reviews;

namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IReviewsService _reviewsService;

        public ReviewsController(PAToolsContext context, IReviewsService reviewsService)
        {
            _reviewsService = reviewsService;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<GetNewReviewDtoResponse>> AddReview(AddReviewDto review)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            review.UserId = userId;
            return Ok(await _reviewsService.AddReview(review));
        }

        [HttpGet("get-all/task={taskId}")]
        public async Task<ActionResult<GetReviewDtoResponse>> GetAllReviews(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Student.ToString()))
                return Ok(new IncorrectUserRoleResponse());
            
            //The user has no id Claim
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(studentIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(studentIdClaim.Value, out var studentId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _reviewsService.GetAllReviews(new GetReviewDtoRequest()
            {
                StudentId = studentId,
                TaskId = taskId
            }));
        }

        [HttpGet("get-all-my/task={taskId}")]
        public async Task<ActionResult<GetMyReviewDtoResponse>> GetAllMyReviews(Guid taskId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _reviewsService.GetAllMyReviews(new GetMyReviewDtoRequest()
            {
                UserId = userId,
                TaskId = taskId
            }));
        }
    }
}