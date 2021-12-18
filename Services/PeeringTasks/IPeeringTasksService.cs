using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.PeeringTasks
{
    public interface IPeeringTasksService
    {
        Task<Response<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview (Guid taskId, Guid teacherId);
        Task<Response<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask);
        Task<Response<List<GetPeeringTaskMainInfoDtoResponse>>> GetCourseTasks(GetCourseTasksDtoRequest courseInfo);
    }
}