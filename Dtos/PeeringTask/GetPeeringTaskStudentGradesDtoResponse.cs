using System;
using System.Collections.Generic;
using patools.Enums;
using System.Collections;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskStudentGradesDtoResponse
    {
        public int? MinGrade { get; set; }
        public float? MaxGrade { get; set; }
        public List<GetPeeringTaskCoordinatesDtoResponse> Coordinates { get; set; }
    }
}