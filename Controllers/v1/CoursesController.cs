using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Course;
using patools.Dtos.Task;
using patools.Enums;
using patools.Models;
using patools.Services.Courses;
using patools.Services.PeeringTasks;
using patools.Errors;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ICoursesService _coursesService;
        private readonly IPeeringTasksService _peeringTasksService;

        public CoursesController(PAToolsContext context, ICoursesService coursesService,IPeeringTasksService peeringTasksService)
        {
            _coursesService = coursesService;
            _peeringTasksService = peeringTasksService;
            _context = context;
        }

        // GET: api/v1/Courses/get/5
        [HttpGet("get/{id:guid}")]
        public async Task<ActionResult<GetCourseDtoResponse>> GetCourse(Guid id)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            return Ok(await _coursesService.GetCourseById(id));
        }

        // PUT: api/v1/Courses/put/courseId
        [HttpPut("put/course={courseId}")]
        public async Task<IActionResult> PutCourse(Guid courseId, PutCourseDto updateCourse)
        {
            //The user is not authenticated (there is no token provided or the token is incorrect)
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _coursesService.PutCourse(teacherId, courseId, updateCourse));
        }

        // GET: api/v1/Courses/get
        [HttpGet("get")]
        public async Task<ActionResult<List<GetCourseDtoResponse>>> GetCourses()
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            if (User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(await _coursesService.GetTeacherCourses(userId));

            if(User.IsInRole(UserRoles.Student.ToString()))
                return Ok(await _coursesService.GetStudentCourses(userId));
            
            return Ok(new InvalidJwtTokenResponse());
        }

        // POST: api/v1/Courses/add
        [HttpPost("add")]
        public async Task<ActionResult<GetCourseDtoResponse>> PostCourse(AddCourseDto course)
        {
            //The user is not authenticated (there is no token provided or the token is incorrect)
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidGuidIdResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            course.TeacherId = teacherId;
            return Ok(await _coursesService.AddCourse(course));
        }

        // DELETE: api/v1/courses/{courseId}
        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(Guid courseId)
        {
            //The user is not authenticated (there is no token provided or the token is incorrect)
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _coursesService.DeleteCourse(new DeleteCourseDto()
            {
                CourseId = courseId,
                TeacherId = teacherId
            }));
        }


        [HttpGet("second-step-available/course={courseId}")]
        public async Task<ActionResult<string>> CheckForSecondStep(Guid courseId)
        {
            //The user is not authenticated (there is no token provided or the token is incorrect)
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidGuidIdResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _coursesService.CheckForSecondStep(new CanCreateCommonTaskDto()
            {
                CourseId = courseId,
                TeacherId = teacherId
            }));
        }
        
        //Should be in CourseService.cs file, Remove after refactoring
        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.ID == id);
        }
    }
}