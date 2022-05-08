using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Google.Apis.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Course;
using patools.Dtos.CourseUser;
using patools.Dtos.Task;
using patools.Dtos.User;
using patools.Enums;
using patools.Models;
using patools.Services.Courses;
using patools.Services.CourseUsers;
using patools.Errors;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CourseUsersController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ICoursesService _coursesService;
        private readonly ICourseUsersService _courseUsersService;

        public CourseUsersController(PAToolsContext context, ICoursesService coursesService,ICourseUsersService courseUsersService)
        {
            _coursesService = coursesService;
            _courseUsersService = courseUsersService;
            _context = context;
        }

        /// <summary>
        /// Получает пользователей курса.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseUser>>> GetCourseUsers()
        {
            var course = await _context.CourseUsers
                    .Include(course => course.Course)
                    .Include(user => user.User)
                    .Include(course => course.Course.Teacher)
                    .Select(x => new {x.Course.ID, x.Course.Title, x.Course.Description, x.Course.CourseCode, x.Course.Subject, x.User.Fullname, x.User.Role, x.User.Email, x.User.ImageUrl})
                    .ToListAsync();
            
            return Ok(course);
        }
        
        /// <summary>
        /// Добавляет нового пользователя курса.
        /// </summary>
        [HttpPost("add")]
        public async Task<ActionResult<string>> PostCourseUser(AddCourseUserDto courseUsersInfo)
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
            
            courseUsersInfo.TeacherId = teacherId;
            return Ok(await _courseUsersService.AddCourseUser(courseUsersInfo));
        }

        // POST: api/v1/CourseUsers/join
        // [HttpPost("join")]
        // public async Task<ActionResult<string>> PostCourseUserStudent(AddCourseUserStudentDto courseUsersStudentInfo)
        // {
        //     //The user is not authenticated (there is no token provided or the token is incorrect)
        //     if(!User.Identity.IsAuthenticated)
        //         return Ok(new UnauthorizedUserResponse());

        //     //The user's role is incorrect for this request
        //     if(!User.IsInRole(UserRoles.Student.ToString()))
        //         return Ok(new IncorrectUserRoleResponse());

        //     //The user has no id Claim
        //     var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        //     if(studentIdClaim == null)
        //         return Ok(new InvalidGuidIdResponse());

        //     //The id stored in Claim is not Guid
        //     if(!Guid.TryParse(studentIdClaim.Value, out var studentId))
        //         return Ok(new InvalidGuidIdResponse());
            
        //     courseUsersStudentInfo.StudentId = studentId;
        //     return Ok(await _courseUsersService.AddCourseUserStudent(courseUsersStudentInfo));
        // }

        /// <summary>
        /// Присоединяется к курсу по коду курса.
        /// </summary>
        [HttpPost("join")]
        public async Task<ActionResult<string>> JoinToCourseByCode(AddCourseUserByCourseCodeDto courseUserInfo)
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
            if(!Guid.TryParse(studentIdClaim.Value, out var studentId))
                return Ok(new InvalidGuidIdResponse());
            
            courseUserInfo.StudentId = studentId;
            return Ok(await _courseUsersService.JoinByCourseCode(courseUserInfo));
        }

        /// <summary>
        /// Получает пользователя курса.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseUser>> GetCourseUser(Guid id)
        {
            var courseUser = await _context.CourseUsers.FindAsync(id);

            if (courseUser == null)
            {
                return NotFound();
            }

            return courseUser;
        }

        /// <summary>
        /// Изменяет пользователя курса.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourseUser(Guid id, CourseUser courseUser)
        {
            if (id != courseUser.ID)
            {
                return BadRequest();
            }

            _context.Entry(courseUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseUserExists(id))
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

        /// <summary>
        /// Удаляет пользователя курса.
        /// </summary>
        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourseUser(Guid courseId)
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
                return Ok(new InvalidJwtTokenResponse());

            //The id stored in Claim is not Guid
            if(!Guid.TryParse(studentIdClaim.Value, out var studentId))
                return Ok(new InvalidJwtTokenResponse());

            return Ok(await _courseUsersService.DeleteCourseUser(new DeleteCourseUserDto()
            {
                CourseId = courseId,
                StudentId = studentId
            }));
        }

        private bool CourseUserExists(Guid id)
        {
            return _context.CourseUsers.Any(e => e.ID == id);
        }
    }
}