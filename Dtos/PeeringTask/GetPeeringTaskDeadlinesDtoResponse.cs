using System;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskDeadlinesDtoResponse
    {
        public DateTime? SubmissionStartDateTime {get; set; }
        public DateTime? SubmissionEndDateTime {get; set; }
        public DateTime? ReviewStartDateTime { get; set; }
        public DateTime? ReviewEndDateTime { get; set; }
    }
}