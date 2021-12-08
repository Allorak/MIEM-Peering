using System;

namespace patools.Dtos.Task
{
    public class AddTaskDto
    {
        public Guid CourseId { get; set; }
        public Guid TeacherId { get; set; }
        public AddTaskMainInfoDto MainInfo { get; set;}
        public AddTaskSettingsDto Settings { get; set;}
        public AddTaskQuestionFormDto AuthorForm { get; set;}
        public AddTaskQuestionFormDto PeerForm { get; set;}
    }
}