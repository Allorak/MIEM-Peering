using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using patools.Enums;

namespace patools.Models
{
    public class PeeringTask
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [DataType(DataType.MultilineText)]
        public string Description { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No start datetime set"
        )]
        [Required]
        public DateTime SubmissionStartDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No submission deadline set"
        )]
        [Required]
        public DateTime SubmissionEndDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No review start datetime set"
        )]
        [Required]
        public DateTime ReviewStartDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No review deadline set"
        )]
        [Required]
        public DateTime ReviewEndDateTime { get; set; }

        public int SubmissionsToCheck { get; set; }

        [Required]
        public Course Course { get; set; }
        
        [Required] 
        public TaskTypes TaskType { get; set; }

        public bool? ExpertsAssigned { get; set; } = null;

        public bool PeersAssigned { get; set; } = false;

        [Required]
        public ReviewTypes ReviewType { get; set; }
        
        [Required]
        public int ReviewWeight { get; set; }
        
        [Required]
        public int SubmissionWeight { get; set; }
        
        public float? GoodConfidenceBonus { get; set; }
        public float? BadConfidencePenalty { get; set; }

        //For LTI Integration
        public bool LtiEnabled { get; set; }
        public int? LtiTaskId { get; set; }
        public string SharedSecret { get; set; }
        public string ConsumerKey { get; set; }
    }
}