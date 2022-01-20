using System;
using System.Collections.Generic;
using patools.Enums;
using System.Collections;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskTeacherOverviewDtoResponse
    {
        public GetPeeringTaskStatisticsDtoResponse Statistics { get; set; }
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public List<int> Grades { get; set; }
        public List<float> CurrentConfidenceFactors { get; set; }
        public List<float?> ConfidenceFactors { get; set; }
        public ReviewTypes? ReviewType { get; set; }
        public TaskTypes? TaskType { get; set; }
        public int? CheckedWorksCount { get; set; }
        public int? AssignedWorksCount { get; set; }
    }
}