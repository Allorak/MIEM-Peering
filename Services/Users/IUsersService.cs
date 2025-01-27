using System;
using System.Threading.Tasks;
using patools.Dtos.User;
using patools.Models;

namespace patools.Services.Users
{
    public interface IUsersService
    {
        Task<Response<GetNewUserDtoResponse>> AddGoogleUser(AddUserDTO newUser);
        Task<Response<GetRegisteredUserDtoResponse>> GetUserProfile(Guid userId);

        Task<Response<GetUserRoleDtoResponse>> GetUserRole(GetUserRoleDtoRequest userInfo);
        Task<Response<string>> AddNativeUser(AddNativeUserDto newUser);
    }
}