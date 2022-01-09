using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace patools.Models
{
    public class Variant
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(200)]
        public string Response { get; set; }

        [Required]
        public Question Question { get; set; }
        
        [Required]
        public int ChoiceId { get; set; } 
    }
}