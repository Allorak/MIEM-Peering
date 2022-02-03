using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.SubmissionPeer;
using patools.Dtos.Task;
using patools.Enums;
using patools.Models;
using patools.Services.PeeringTasks;
using patools.Errors;
namespace patools.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IPeeringTasksService _peeringTasksService;

        private static readonly List<string> columnNames = new List<string>()
        {
            "Имя студента",
            "Email",
            "Сдал работу",
            "Назначено работ",
            "Проверено работ",
            "Оценка за работу",
            "Оценка за проверку",
            "Итоговая оценка",
            "Проверена учителем",
            "Качество проверки",
            "Предыдущий коэффициент доверия",
            "Итоговый коэффициент доверия"
        };

        public TasksController(PAToolsContext context, IPeeringTasksService peeringTasksService)
        {
            _peeringTasksService = peeringTasksService;
            _context = context;
        }

        [HttpGet("overview/task={taskId:guid}")]
        public async Task<ActionResult<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());

            /*
            if (User.IsInRole(UserRoles.Teacher.ToString()))
            {
                var taskInfo = new GetPeeringTaskTeacherOverviewDtoRequest()
                {
                    TeacherId = userId,
                    TaskId = taskId
                };
                return Ok(await _peeringTasksService.GetTaskTeacherOverview(taskInfo));
            }

            if (User.IsInRole(UserRoles.Student.ToString()))
            {
                var taskInfo = new GetPeeringTaskStudentOverviewRequest()
                {
                    StudentId = userId,
                    TaskId = taskId
                };
                return Ok(await _peeringTasksService.GetTaskStudentOverview(taskInfo));
            }

            return Ok(new InvalidJwtTokenResponse());*/
            return Ok(await _peeringTasksService.GetTaskOverview(new GetPeeringTaskOverviewDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }

        [HttpGet("author-form/task={taskId:guid}")]
        public async Task<ActionResult<GetAuthorFormDtoResponse>> GetAuthorForm(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());
            var taskInfo = new GetAuthorFormDtoRequest
            {
                TaskId = taskId,
                UserId = userId
            };
            return Ok(await _peeringTasksService.GetAuthorForm(taskInfo));
        }

        [HttpGet("peer-form/task={taskId:guid}")]
        public async Task<ActionResult<GetPeerFormDtoResponse>> GetPeerForm(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());
            var taskInfo = new GetPeerFormDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            };
            return Ok(await _peeringTasksService.GetPeerForm(taskInfo));
        }

        [HttpPost("add")]
        public async Task<ActionResult<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            peeringTask.TeacherId = teacherId;
            return Ok(await _peeringTasksService.AddTask(peeringTask));
        }

        [HttpGet("get/course={courseId:guid}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetCourseTasks([FromRoute] Guid courseId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            var taskCourseInfo = new GetCourseTasksDtoRequest
            {
                CourseId = courseId,
                UserId = userId
            };

            if (User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(await _peeringTasksService.GetTeacherCourseTasks(taskCourseInfo));

            if (User.IsInRole(UserRoles.Student.ToString()))
                return Ok(await _peeringTasksService.GetStudentCourseTasks(taskCourseInfo));

            return Ok(new InvalidJwtTokenResponse());
        }

        [HttpGet("submission-deadline/task={taskId:guid}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetSubmissionDeadline([FromRoute] Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _peeringTasksService.GetTaskSubmissionDeadline(new GetTaskDeadlineDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }

        [HttpGet("review-deadline/task={taskId:guid}")]
        public async Task<ActionResult<GetCourseTasksDtoResponse>> GetReviewDeadline([FromRoute] Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _peeringTasksService.GetTaskReviewDeadline(new GetTaskDeadlineDtoRequest()
            {
                TaskId = taskId,
                UserId = userId
            }));
        }

        [HttpGet("get-performance-table/task={taskId:guid}")]
        public async Task<ActionResult<GetPerformanceTableDtoResponse>> GetPerformanceTable(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _peeringTasksService.GetPerformanceTable(new GetPerformanceTableDtoRequest()
            {
                TaskId = taskId,
                TeacherId = teacherId
            }));
        }

        [HttpGet("download-csv/task={taskId:guid}")]
        public async Task<IActionResult> DownloadPerformanceCsv(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidJwtTokenResponse());

            var performanceTable = (await _peeringTasksService.GetPerformanceTable(new GetPerformanceTableDtoRequest()
            {
                TaskId = taskId,
                TeacherId = teacherId
            })).Payload;

            if (performanceTable == null)
                return Ok(new OperationErrorResponse());

            var builder = new StringBuilder();
            var columns = columnNames.Aggregate(string.Empty, (current, columnName) => current + (columnName + ","));
            columns = columns.Remove(columns.Length - 1);
            
            builder.AppendLine(columns);
            foreach (var student in performanceTable.Students)
            {
                builder.AppendLine(
                    $"{student.Fullname},{student.Email},{student.Submitted},{student.AssignedSubmissions},{student.ReviewedSubmissions}"
                    + $"{student.SubmissionGrade},{student.ReviewGrade},{student.FinalGrade},{student.TeacherReviewed},{student.ReviewQuality},{student.PreviousConfidenceFactor},{student.NextConfidenceFactor}");
            }

            return File(Encoding.UTF32.GetBytes(builder.ToString()), "text/csv", "PerformanceTable.csv");
        }

        [HttpGet("download-excel/task={taskId:guid}")]
        public async Task<IActionResult> DownloadPerformanceExcel(Guid taskId)
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if (!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if (!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidJwtTokenResponse());

            var performanceTable = (await _peeringTasksService.GetPerformanceTable(new GetPerformanceTableDtoRequest()
            {
                TaskId = taskId,
                TeacherId = teacherId
            })).Payload;

            if (performanceTable == null)
                return Ok(new OperationErrorResponse());

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Успеваемость");
            var currentRow = 1;
            for (var i = 0; i < columnNames.Count; i++)
            {
                worksheet.Cell(currentRow, i+1).Value = columnNames[i];
            }

            foreach (var student in performanceTable.Students)
            {
                currentRow++;
                worksheet.Cell(currentRow, 1).Value = student.Fullname;
                worksheet.Cell(currentRow, 2).Value = student.Email;
                worksheet.Cell(currentRow, 3).Value = student.Submitted;
                worksheet.Cell(currentRow, 4).Value = student.AssignedSubmissions;
                worksheet.Cell(currentRow, 5).Value = student.ReviewedSubmissions;
                worksheet.Cell(currentRow, 6).Value = student.SubmissionGrade;
                worksheet.Cell(currentRow, 7).Value = student.ReviewGrade;
                worksheet.Cell(currentRow, 8).Value = student.FinalGrade;
                worksheet.Cell(currentRow, 9).Value = student.TeacherReviewed;
                worksheet.Cell(currentRow, 10).Value = student.ReviewQuality;
                worksheet.Cell(currentRow, 11).Value = student.PreviousConfidenceFactor;
                worksheet.Cell(currentRow, 12).Value = student.NextConfidenceFactor;
            }

            await using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            return File(content,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","PerformanceTable.xlsx");
        }
    }
}