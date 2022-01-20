using System;
using System.Collections.Generic;
using patools.Enums;
using System.Collections;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskStudentOverviewDtoResponse
    {
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public GetPeeringTaskStatusDtoResponse Status { get; set; }
        public bool SubmissionStatus { get; set; }
        public GetPeeringTaskStudentGradesDtoResponse StudentGrades { get; set; }
        public TaskTypes? Step { get; set; }
        public GetPeeringTaskСoefficientsDtoResponse StudentConfidenceСoefficients { get; set; }
        public int? CheckedWorksCount { get; set; }
        public int? AssignedWorksCount { get; set; }
    }
}