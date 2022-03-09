using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using patools.Enums;

namespace patools.Models
{

    public class PeeringTaskUser
    {
        public Guid ID { get; set; }

        [Required]
        public PeeringTask PeeringTask { get; set; }

        [Required]
        public User Student { get; set; }

        [Required]
        public PeeringTaskStates State { get; set; }

        public float? FinalGrade { get; set; }
        public float? SubmissionGrade { get; set; }
        public float? ReviewGrade { get; set; }

        [Required]
        public float PreviousConfidenceFactor { get; set; }
        public float? NextConfidenceFactor { get; set; }

        public bool JoinedByLti { get; set; }
        public bool ReceivedLtiGrade { get; set; }
    }
}