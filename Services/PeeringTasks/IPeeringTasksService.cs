using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Task;
using patools.Models;

namespace patools.Services.PeeringTasks
{
    public interface IPeeringTasksService
    {
        Task<Response<GetPeeringTaskTeacherOverviewDtoResponse>> GetTaskTeacherOverview (GetPeeringTaskTeacherOverviewDtoRequest taskInfo);
        Task<Response<GetPeeringTaskStudentOverviewDtoResponse>> GetTaskStudentOverview (GetPeeringTaskStudentOverviewRequest taskInfo);
        Task<Response<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask);
        Task<Response<GetCourseTasksDtoResponse>> GetTeacherCourseTasks(GetCourseTasksDtoRequest courseInfo);
        Task<Response<GetCourseTasksDtoResponse>> GetStudentCourseTasks(GetCourseTasksDtoRequest courseInfo);
        Task<Response<GetAuthorFormDtoResponse>> GetAuthorForm(GetAuthorFormDtoRequest taskInfo);
    }
}