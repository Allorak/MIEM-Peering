using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Subject
    {
        [Key]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}