using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using patools.Enums;

namespace patools.Models
{

    public class GroupUser
    {
        public Guid ID { get; set; }

        [Required]
        public Group Group { get; set; }

        [Required]
        public User Student { get; set; }

        [Required]
        public Subgroups Subgroup { get; set; }
    }
}