using System;

namespace patools.Dtos.Task
{
    public class AddPeeringTaskDto
    {
        public Guid CourseId { get; set; }
        public Guid TeacherId { get; set; }
        public AddPeeringTaskMainInfoDto MainInfo { get; set;}
        public AddPeeringTaskSettingsDto Settings { get; set;}
        public AddPeeringTaskQuestionFormDto AuthorForm { get; set;}
        public AddPeeringTaskQuestionFormDto PeerForm { get; set;}
    }
}