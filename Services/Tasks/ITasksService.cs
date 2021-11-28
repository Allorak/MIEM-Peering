using System;
using System.Threading.Tasks;
using patools.Dtos.Task;

namespace patools.Services.Tasks
{
    public interface ITasksService
    {
        Task<Response<GetTaskOverviewDTO>> GetTaskOverview (Guid taskId);
    }
}