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

        // GET: api/v1/Courses/get
        [HttpGet("get")]
        public async Task<ActionResult<List<GetCourseDtoResponse>>> GetCourses()
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            return Ok(await _coursesService.GetAllCourses());
        }

        // GET: api/CourseUsers
        [HttpGet("getnew")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesss()
        {
             var courses = _context.Courses
                .Include(course => course.Teacher)
                .Include(course => course.Settings)
                .Select(x => new {x.ID, x.Title, x.Description, x.Subject, x.Teacher.Fullname, x.Teacher.Role, x.Settings.enableCode, x.Settings.CourseCode});
            
            return Ok(courses.ToList());
        }

        // GET: api/v1/Courses/get/5
        [HttpGet("get/{id:guid}")]
        public async Task<ActionResult<GetCourseDtoResponse>> GetCourse(Guid id)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            return Ok(await _coursesService.GetCourseById(id));
        }

        // PUT: api/v1/Courses/put/5
        //Refactoring is needed
        [HttpPut("put/{id:guid}")]
        public async Task<IActionResult> PutCourse(Guid id, Course course)
        {
            if (id != course.ID)
            {
                return BadRequest();
            }

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // GET: api/v1/Courses/getcourses
        [HttpGet("getcourses")]
        public async Task<ActionResult<List<GetCourseDtoResponse>>> GetCoursess()
        //public async Task<ActionResult<GetCourseDTO>> GetTeacherCourse()
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
        /*
        [HttpGet("getstudentcourse")]
        public async Task<ActionResult<List<GetCourseDtoResponse>>> GetStudentCourse()
        //public async Task<ActionResult<GetCourseDTO>> GetTeacherCourse()
        {
            //The user is not authenticated (there is no token provided or the token is incorrect)
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            //The user's role is incorrect for this request
            if(!User.IsInRole(UserRoles.Student.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(studentIdClaim == null)
                return Ok(new InvalidGuidIdResponse());

            //The id stored in Claim is not Guid
            Guid studentId;
            if(!Guid.TryParse(studentIdClaim.Value, out studentId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _coursesService.GetStudentCourses(studentId));
        }
        */

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

        // DELETE: api/v1/Courses/delete/5
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
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

            return Ok(await _coursesService.DeleteCourse(teacherId, id));
        }
        
        //Should be in CourseService.cs file, Remove after refactoring
        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.ID == id);
        }
    }
}