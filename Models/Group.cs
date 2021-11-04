using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace patools.Models
{
    public class Group
    {
        public Guid ID { get; set; }

        [Required]
        [MaxLength(10)]
        public string Name { get; set; }

        public List<GroupUser> GroupUsers { get; set; }
    }
}