using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace patools.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TaskState
    {
        Assigned = 0,
        Checking = 1,
        Graded = 2
    }

    public class TaskUser
    {
        public Guid ID { get; set; }

        [Required]
        public Task Task { get; set; }

        [Required]
        public User Student { get; set; }

        [Required]
        public TaskState State { get; set; }
    }
}