using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Task
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }
        
        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No start datetime set"
        )]
        public DateTime? StartDatetime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No completion deadline set"
        )]
        public DateTime? CompletionDeadlineDatetime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No check start datetime set"
        )]
        public DateTime? CheckStartDatetime { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat
        (
            DataFormatString = "{0:yyyy-MM-dd}",
            ApplyFormatInEditMode = true,
            NullDisplayText = "No check deadline set"
        )]
        public DateTime? CheckDeadlineDatetime { get; set; }
        
        //Todo: Проверка что значение >=1
        public int SubmissionsToCheck { get; set; }

        [Required]
        public Course Course { get; set; }

        public List<Question> Questions { get; set; }
        public List<TaskUser> TaskUsers { get; set; }
    }
}