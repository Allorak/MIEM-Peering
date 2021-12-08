using System;

namespace patools.Dtos.Task
{
    public class GetTaskDeadlinesDtoResponse
    {
        public DateTime? SubmissionStartDateTime {get; set; }
        public DateTime? SubmissionEndDateTime {get; set; }
        public DateTime? ReviewStartDateTime { get; set; }
        public DateTime? ReviewEndDateTime { get; set; }
    }
}