using System;
using System.Collections.Generic;
using patools.Enums;

namespace patools.Dtos.Task
{
    public class AddPeeringTaskSettingsDto
    {
        public DateTime? SubmissionStartDateTime {get; set; }
        public DateTime? SubmissionEndDateTime {get; set; }
        public DateTime? ReviewStartDateTime { get; set; }
        public DateTime? ReviewEndDateTime { get; set; }
        public int SubmissionsToCheck {get; set; }
        public List<string> Experts { get; set; }
        public ReviewTypes Type { get; set; }
    }
}