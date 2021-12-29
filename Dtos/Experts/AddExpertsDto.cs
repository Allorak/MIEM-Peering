using System;
using System.Collections.Generic;
using patools.Enums;

namespace patools.Dtos.Experts
{
    public class AddExpertsDto
    {
        public PeeringSteps Step { get; set; }
        public List<string> Experts { get; set; }
        public Guid? TaskId { get; set; }
    }
}