using System;
using System.Collections.Generic;
using patools.Enums;
using System.Collections;
using patools.Models;

namespace patools.Dtos.Task
{
    public class GetPeeringTaskCoordinatesDtoResponse
    {
        public float Value { get; set; }
        public UserRoles Reviewer { get; set; }
        public string Name { get; set; }
    }
}