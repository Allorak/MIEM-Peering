using System;
using System.Collections.Generic;
using patools.Dtos.Variants;
using patools.Enums;

namespace patools.Dtos.Question
{
    public class GetPeerQuestionDtoResponse
    {
        public Guid QuestionId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Required { get; set; }
        public QuestionTypes Type { get; set; }
        public List<GetVariantDtoResponse> Responses { get; set; }
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
        public float? CoefficientPercentage { get; set; }
    }
}