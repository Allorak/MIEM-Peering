using System;
using System.Threading.Tasks;
using patools.Dtos.User;
using patools.Models;

namespace patools.Services.Users
{
    public interface IUsersService
    {
        Task<Response<GetNewUserDTO>> AddGoogleUser(User newUser);
        Task<Response<GetRegisteredUserDTO>> GetUserProfile(Guid userId);
    }
}