using patools.Models;

namespace patools.Dtos.Question
{
    public class GetQuestionDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Required { get; set; }
        public QuestionTypes Type { get; set; }
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
    }
}