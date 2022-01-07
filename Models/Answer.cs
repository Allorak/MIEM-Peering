using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Answer
    {
        public Guid ID { get; set; }
        
        [Required]
        public Submission Submission { get; set; }
        
        [Required]
        public Question Question { get; set; }

        public int? Value { get; set; }
        public string Review { get; set; }

        public int Grade { get; set; }
    }
}