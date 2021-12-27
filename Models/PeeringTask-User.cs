using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace patools.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PeeringTaskState
    {
        Assigned = 0,
        Checking = 1,
        Graded = 2
    }

    public class PeeringTaskUser
    {
        public Guid ID { get; set; }

        [Required]
        public PeeringTask PeeringTask { get; set; }

        [Required]
        public User Student { get; set; }

        [Required]
        public PeeringTaskState State { get; set; }
    }
}