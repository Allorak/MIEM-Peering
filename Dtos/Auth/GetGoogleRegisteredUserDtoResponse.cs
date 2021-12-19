using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using patools.Models;
using patools.Dtos.User;

namespace patools.Dtos.Auth
{
    public class GetGoogleRegisteredUserDtoResponse
    {
        public string Status { get; set; }
        public GetRegisteredUserDtoResponse User { get; set; }
        public string AccessToken { get; set; }
    }
}