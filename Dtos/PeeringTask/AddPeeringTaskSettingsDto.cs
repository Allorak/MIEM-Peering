using System;

namespace patools.Dtos.Task
{
    public class AddPeeringTaskSettingsDto
    {
        public DateTime? SubmissionStartDateTime {get; set; }
        public DateTime? SubmissionEndDateTime {get; set; }
        public DateTime? ReviewStartDateTime { get; set; }
        public DateTime? ReviewEndDateTime { get; set; }
        public int SubmissionsToCheck {get; set; }
    }
}