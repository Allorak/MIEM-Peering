using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.Tasks
{
    public interface ITasksService
    {
        Task<Response<GetTaskOverviewDTO>> GetTaskOverview (Guid taskId, Guid teacherId);
        Task<Response<GetNewTaskDTO>> AddTask(Guid courseId, Guid teacherId, AddTaskDTO task);
        Task<Response<IEnumerable<GetTaskMainInfoDTO>>> GetCourseTasks(Guid courseId, Guid userId, UserRoles userRole);
        Task<Response<GetAuthorFormDTO>> GetAuthorForm(Guid taskId, Guid userId);
    }
}