using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using patools.Enums;

namespace patools.Models
{

    

    public class Question
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [DataType(DataType.MultilineText)]
        public string Description { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public bool Required { get; set; }

        [Required]
        public QuestionTypes Type { get; set; }

        [Required]
        public RespondentTypes RespondentType { get; set; }

        //for select-type questions
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
        
        public float? CoefficientPercentage { get; set; }

        [Required]
        public PeeringTask PeeringTask { get; set; }
    }
}