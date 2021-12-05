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
using patools.Services.Tasks;
using patools.Errors;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ICoursesService _coursesService;
        private readonly ITasksService _tasksService;

        public CoursesController(PAToolsContext context, ICoursesService coursesService,ITasksService tasksService)
        {
            _coursesService = coursesService;
            _tasksService = tasksService;
            _context = context;
        }

        /*
        // GET: api/v1/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.ToListAsync();
        }
        */

        // GET: api/v1/Courses/get
        [HttpGet("get")]
        public async Task<ActionResult<List<Course>>> GetCourses()
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            return Ok(await _coursesService.GetAllCourses());
        }

        // GET: api/v1/Courses/get/5
        [HttpGet("get/{id:guid}")]
        public async Task<ActionResult<Course>> GetCourse(Guid id)
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

        // POST: api/v1/Courses/add
        [HttpPost("add")]
        public async Task<ActionResult<GetCourseDTO>> PostCourse(AddCourseDTO course)
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

            return Ok(await _coursesService.AddCourse(teacherId, course));
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

        [HttpPost("{courseId:guid}/tasks/add")]
        public async Task<ActionResult<GetNewTaskDTO>> AddTask([FromRoute] Guid courseId, AddTaskDTO task)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            if(!User.IsInRole(UserRoles.Teacher.ToString()))
                return Ok(new IncorrectUserRoleResponse());

            //The user has no id Claim
            var teacherIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(teacherIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Ok(new InvalidGuidIdResponse());

            return Ok(await _tasksService.AddTask(courseId, teacherId, task));
        }

        [HttpGet("{courseId:guid}/tasks/get")]
        public async Task<ActionResult<List<GetTaskMainInfoDTO>>> GetCourseTasks([FromRoute] Guid courseId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());

            UserRoles? role = null;
            if(User.IsInRole(UserRoles.Teacher.ToString()))
                role = UserRoles.Teacher;
            if(User.IsInRole(UserRoles.Student.ToString()))
                role = UserRoles.Student;
            if (!role.HasValue)
                return Ok(new InvalidJwtTokenResponse());
            
            
            //The user has no id Claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _tasksService.GetCourseTasks(courseId, userId, role.Value));
        }
        //Should be in CourseService.cs file, Remove after refactoring
        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.ID == id);
        }
    }
}