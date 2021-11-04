using System;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Variant
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(200)]
        public string Content { get; set; }

        [Required]
        public Question Question { get; set; }
    }
}