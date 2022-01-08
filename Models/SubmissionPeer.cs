using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class SubmissionPeer
    {
        [Required]
        public Guid ID { get; set; }
        [Required]
        public Submission Submission { get; set; }
        [Required]
        public User Peer { get; set; }
    }
}