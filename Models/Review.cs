using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Review
    {
        public Guid ID { get; set; }
        
        [Required] 
        public SubmissionPeer SubmissionPeerAssignment { get; set; }

        [Required]
        public float Grade { get; set; }
    }
}