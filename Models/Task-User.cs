using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public enum TaskState 
    { 
        Assigned,
        Checking,
        Graded
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