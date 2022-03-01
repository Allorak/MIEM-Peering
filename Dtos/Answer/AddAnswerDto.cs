using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace patools.Dtos.Answer
{
    public class AddAnswerDto
    {
        public Guid QuestionId { get; set; }
        
        public string Response { get; set; }    
        public int? Value { get; set; }
        public IFormFile File { get; set; }
    }
}