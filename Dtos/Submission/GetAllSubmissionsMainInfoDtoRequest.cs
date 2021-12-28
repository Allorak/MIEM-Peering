using System;

namespace patools.Dtos.Submission
{
    public class GetAllSubmissionsMainInfoDtoRequest
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
    }
}