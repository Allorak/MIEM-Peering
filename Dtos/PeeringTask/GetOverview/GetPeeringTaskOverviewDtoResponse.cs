using System.Collections.Generic;
using patools.Enums;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskOverviewDtoResponse
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public TaskTypes? TaskType { get; set; }
        
        //Student-only
        public bool? SubmissionStatus { get; set; }
        public GetPeeringTaskStudentGradesDtoResponse StudentGrades { get; set; }
        public GetPeeringTaskConfidenceFactorsDtoResponse StudentConfidenceFactors { get; set; }
        
        public float? SubmissionGrade { get; set; }
        public float? ReviewGrade { get; set; }
        public float? FinalGrade { get; set; }
        //Student and expert
        public int? ReviewedSubmissions { get; set; }
        public int? AssignedSubmissions { get; set; }
        
        //Teacher-only
        public GetPeeringTaskStatisticsDtoResponse Statistics { get; set; }
        public List<float?> Grades { get; set; }
        public List<float> CurrentConfidenceFactors { get; set; }
        public List<float?> ConfidenceFactors { get; set; }
        public ReviewTypes? ReviewType { get; set; }
        public string LtiSharedSecret { get; set; }
        public string LtiConsumerKey { get; set; }

        //Teacher and student
        public int? SubmissionWeight { get; set; }
        public int? ReviewWeight { get; set; }
        public float? GoodConfidenceBonus { get; set; }
        public float? BadConfidencePenalty { get; set; }
        
    }
}