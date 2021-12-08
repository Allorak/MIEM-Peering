using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.Tasks
{
    public interface ITasksService
    {
        Task<Response<GetTaskOverviewDtoResponse>> GetTaskOverview (Guid taskId, Guid teacherId);
        Task<Response<GetNewTaskDtoResponse>> AddTask(AddTaskDto task);
        Task<Response<List<GetTaskMainInfoDtoResponse>>> GetCourseTasks(GetCourseTasksDtoRequest courseInfo);
    }
}