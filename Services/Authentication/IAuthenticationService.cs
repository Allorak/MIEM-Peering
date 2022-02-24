using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools;
using patools.Dtos.Auth;

namespace patools.Services.Authentication
{
    public interface IAuthenticationService
    {
        Task<Response<GetJwtTokenDtoResponse>> GetJwtByEmail(string email);

        Task<Response<GetGoogleRegisteredUserDtoResponse>> FindUserByEmail(string email);

        Task<Response<string>> IsLtiTokenUserRegistered(string userToken);
    }
}