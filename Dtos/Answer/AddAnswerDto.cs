using System;

namespace patools.Dtos.Answer
{
    public class AddAnswerDto
    {
        public Guid QuestionId { get; set; }
        
        public string Response { get; set; }    
        public int? Value { get; set; }
    }
}