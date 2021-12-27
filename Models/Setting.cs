using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Setting
    {
        public Guid ID { get; set; }

        [Required]
        public bool enableCode { get; set; }

        [MaxLength(6)]
        public string CourseCode { get; set; }
    }
}