using System;

namespace patools.Dtos.Review
{
    public class GetReviewDtoRequest
    {
        public Guid StudentId { get; set; }
        public Guid TaskId { get; set; }
    }
}