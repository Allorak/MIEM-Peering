using Microsoft.EntityFrameworkCore.Metadata.Internal;
using patools.Enums;

namespace patools.Dtos.User
{
    public class GetStudentPerformanceDtoResponse
    {
        public string Fullname { get; set; }
        public string ImageUrl { get; set; }
        public float PreviousCoefficient { get; set; }
        public float? NextCoefficient { get; set; }
        public bool Submitted { get; set; }
        public int? AssignedPeers { get; set; }
        public int? ReviewedPeers { get; set; }
        public bool TeacherReviewed { get; set; }
        public int? FinalGrade { get; set; }
        public ReviewQualities? ReviewQuality { get; set; }
    }
}