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
        public List<GetGradesTeacherOverviewDtoResponse> Grades { get; set; }
        public List<GetCurrentConfidenceСoefficientsDtoResponse> CurrentConfidenceСoefficients { get; set; }
        public List<GetConfidenceСoefficientsDtoResponse> ConfidenceСoefficients { get; set; }
        //public List<GetVariantDtoResponse> CurrentConfidenceСoefficients { get; set; }
        //public List<GetVariantDtoResponse> ConfidenceСoefficients { get; set; }
    }
}