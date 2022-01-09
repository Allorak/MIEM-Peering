using System.Collections.Generic;
using patools.Dtos.Variants;
using patools.Enums;
using patools.Models;

namespace patools.Dtos.Question
{
    public class AddAuthorQuestionDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public bool Required { get; set; }
        public QuestionTypes Type { get; set; }
        public List<AddVariantDto> Responses { get; set; }
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
    }
}