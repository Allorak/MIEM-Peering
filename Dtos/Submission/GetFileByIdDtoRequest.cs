using System;

namespace patools.Dtos.Submission
{
    public class GetFileByIdDtoRequest
    {
        public Guid UserId { get; set; }
        public Guid AnswerFileId { get; set; }
    }
}