using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Expert
    {
        [Required] 
        public Guid ID { get; set; }
        
        [Required]
        public string Email { get; set; }
        
        [Required] 
        public PeeringTask PeeringTask { get; set; }
        
        public User User { get; set; }
    }
}