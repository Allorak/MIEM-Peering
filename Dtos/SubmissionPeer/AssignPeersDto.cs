using System;

namespace patools.Dtos.SubmissionPeer
{
    public class AssignPeersDto
    {
        public Guid TaskId { get; set; }
        public int SubmissionsToCheck { get; set; }
    }
}