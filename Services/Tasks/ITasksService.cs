using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.Tasks
{
    public interface ITasksService
    {
        Task<Response<GetTaskOverviewDTO>> GetTaskOverview (Guid taskId);
        Task<Response<GetNewTaskDTO>> AddTask(Guid courseId, Guid teacherId, AddTaskDTO task);
        Task<Response<List<GetTaskMainInfoDTO>>> GetCourseTasks(Guid courseId, Guid userId, UserRoles userRole);
    }
}