using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Answer
    {
        public Guid ID { get; set; }
        
        public Submission Submission { get; set; }
        
        public Review Review { get; set; }
        
        [Required]
        public Question Question { get; set; }

        public int? Value { get; set; }
        public string Response { get; set; }
    }
}