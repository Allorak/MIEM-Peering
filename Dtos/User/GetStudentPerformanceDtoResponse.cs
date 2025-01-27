using Microsoft.EntityFrameworkCore.Metadata.Internal;
using patools.Enums;

namespace patools.Dtos.User
{
    public class GetStudentPerformanceDtoResponse
    {
        public string Fullname { get; set; }
        public string ImageUrl { get; set; }
        public string Email { get; set; }
        public float PreviousConfidenceFactor { get; set; }
        public float? NextConfidenceFactor { get; set; }
        public bool Submitted { get; set; }
        public int? AssignedSubmissions { get; set; }
        public int? ReviewedSubmissions { get; set; }
        public bool TeacherReviewed { get; set; }
        public float? FinalGrade { get; set; }
        public float? SubmissionGrade { get; set; }
        public float? ReviewGrade { get; set; }
        public string GradeComment { get; set; }
        public string ConfidenceComment { get; set; }
        public ConfidenceFactorQualities? ReviewQuality { get; set; }
        public bool JoinedByLti { get; set; }
        public bool ReceivedLtiGrade { get; set; }
    }
}