using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public enum Types
    {
        LongAnswer,
        MultipleChoices
    }

    public class Question
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        [MaxLength(300)]
        [DisplayFormat(NullDisplayText = "No criteria set")]
        public string Criteria { get; set; }

        [Required]
        public Types Type { get; set; }

        [Required]
        public Task Task { get; set; }

        public List<Variant> Variants { get; set; }
    }
}