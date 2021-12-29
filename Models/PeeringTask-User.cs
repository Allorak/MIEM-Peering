using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using patools.Enums;

namespace patools.Models
{

    public class PeeringTaskUser
    {
        public Guid ID { get; set; }

        [Required]
        public PeeringTask PeeringTask { get; set; }

        [Required]
        public User Student { get; set; }

        [Required]
        public PeeringTaskStates States { get; set; }
    }
}