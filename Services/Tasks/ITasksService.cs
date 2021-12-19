using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.Tasks
{
    public interface ITasksService
    {
        Task<Response<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview (Guid taskId, Guid teacherId);
        Task<Response<GetNewPeeringTaskDtoResponse>> AddTask(Guid courseId, Guid teacherId, AddPeeringTaskDto task);
        Task<Response<IEnumerable<GetPeeringTaskMainInfoDtoResponse>>> GetCourseTasks(Guid courseId, Guid userId, UserRoles userRole);
        Task<Response<GetAuthorFormDTO>> GetAuthorForm(Guid taskId, Guid userId);
    }
}