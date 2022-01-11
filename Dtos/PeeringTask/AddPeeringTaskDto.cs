using System;
using patools.Dtos.Experts;

namespace patools.Dtos.Task
{
    public class AddPeeringTaskDto
    {
        public Guid CourseId { get; set; }
        public Guid TeacherId { get; set; }
        public AddPeeringTaskMainInfoDto MainInfo { get; set;}
        public AddPeeringTaskSettingsDto Settings { get; set;}
        public AddPeeringTaskAuthorFormDto AuthorForm { get; set;}
        public AddPeeringTaskPeerFormDto PeerForm { get; set;}
    }
}