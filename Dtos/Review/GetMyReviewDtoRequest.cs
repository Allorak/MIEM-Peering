using System;

namespace patools.Dtos.Review
{
    public class GetMyReviewDtoRequest
    {
        public Guid UserId { get; set; }
        public Guid TaskId { get; set; }
    }
}