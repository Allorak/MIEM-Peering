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

        public string Description { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No start datetime set"
        )]
        public DateTime? SubmissionStartDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No submission deadline set"
        )]
        public DateTime? SubmissionEndDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No review start datetime set"
        )]
        public DateTime? ReviewStartDateTime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No review deadline set"
        )]
        public DateTime? ReviewEndDateTime { get; set; }

        public int SubmissionsToCheck { get; set; }

        [Required]
        public Course Course { get; set; }
        
        [Required] 
        public PeeringSteps Step { get; set; }

        public PeeringTask ExpertTask { get; set; }

    }
}