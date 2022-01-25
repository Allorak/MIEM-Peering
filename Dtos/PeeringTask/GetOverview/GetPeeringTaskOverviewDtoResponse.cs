using System.Collections.Generic;
using patools.Enums;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskOverviewDtoResponse
    {
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public TaskTypes? TaskType { get; set; }
        
        //Student-only
        public GetPeeringTaskStatusDtoResponse Status { get; set; }
        public bool SubmissionStatus { get; set; }
        public GetPeeringTaskStudentGradesDtoResponse StudentGrades { get; set; }
        public GetPeeringTaskConfidenceFactorsDtoResponse StudentConfidenceFactors { get; set; }
        
        //Teacher-only
        public GetPeeringTaskStatisticsDtoResponse Statistics { get; set; }
        public List<int> Grades { get; set; }
        public List<float> CurrentConfidenceFactors { get; set; }
        public List<float?> ConfidenceFactors { get; set; }
        public ReviewTypes? ReviewType { get; set; }
        
        //Expert-only
        public int? CheckedWorksCount { get; set; }
        public int? AssignedWorksCount { get; set; }
    }
}