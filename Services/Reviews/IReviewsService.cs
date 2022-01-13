using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Review;

namespace patools.Services.Reviews
{
    public interface IReviewsService
    {
        Task<Response<GetNewReviewDtoResponse>> AddReview(AddReviewDto review);
        Task<Response<IEnumerable<GetReviewDtoResponse>>> GetAllReviews(GetReviewDtoRequest taskInfo);
    }
}