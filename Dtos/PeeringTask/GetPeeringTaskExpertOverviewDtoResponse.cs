using System;
using System.Collections.Generic;
using patools.Enums;
using System.Collections;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskExpertOverviewDtoResponse
    {
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public int CheckedWorksCount { get; set; }
        public int AssignedWorksCount { get; set; }
    }
}