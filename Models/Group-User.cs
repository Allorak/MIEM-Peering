using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace patools.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Subgroups
    {
        First = 1,
        Second = 2
    }

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