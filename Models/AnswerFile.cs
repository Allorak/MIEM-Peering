using System;

namespace patools.Models
{
    public class AnswerFile
    {
        public Guid ID { get; set; }
        public Answer Answer { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
    }
}