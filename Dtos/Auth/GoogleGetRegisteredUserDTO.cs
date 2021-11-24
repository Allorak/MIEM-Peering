using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;
using project401.Dtos.User;

namespace project401.Dtos.Auth
{
    public class GoogleGetRegisteredUserDTO
    {
        public string Status { get; set; }
        public GetRegisteredUserDTO User { get; set; }
    }
}