using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Submission
    {
        public Guid ID { get; set; }
        
        [Required]
        public PeeringTaskUser PeeringTaskUserAssignment { get; set; }     
    }
}