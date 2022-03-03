using System;
using System.Collections.Generic;
using patools.Dtos.Variants;
using patools.Enums;

namespace patools.Dtos.Answer
{
    public class GetAnswerDtoResponse
    {
        public Guid QuestionId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Required { get; set; }
        public QuestionTypes Type { get; set; }
        public string Response { get; set; }
        public int? Value { get; set; }

        public IEnumerable<GetAnswerFileInfoDto> Files { get; set; }
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
        public IEnumerable<GetVariantDtoResponse> Responses { get; set; }
        public float? CoefficientPercentage { get; set; }
    }
}