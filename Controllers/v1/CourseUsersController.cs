using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Course;
using patools.Dtos.CourseUser;
using patools.Dtos.Task;
using patools.Dtos.User;
using patools.Models;
using patools.Services.Courses;
using patools.Services.Tasks;
using patools.Errors;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CourseUsersController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public CourseUsersController(PAToolsContext context)
        {
            _context = context;
        }

        // GET: api/CourseUsers
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseUser>>> GetCourseUsers()
        {
            return await _context.CourseUsers
                .Include(course => course.Course)
                //.Include(user => user.User)
                //.Include(course => course.Course.Teacher)
                .ToListAsync();
        }
        */

        // GET: api/v1/CourseUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseUser>>> GetCourseUsers()
        {
            var course = _context.CourseUsers
                    .Include(course => course.Course)
                    .Include(user => user.User)
                    .Include(course => course.Course.Teacher)
                    .Select(x => new {x.Course.ID, x.Course.Title, x.Course.Description, x.Course.CourseCode, x.Course.Subject, x.User.Fullname, x.User.Role, x.User.Email, x.User.ImageUrl});
            
            return Ok(course.ToList());
        }
        
        /*
        // POST: api/v1/CourseUsers/emailStudent
        [HttpPost("{courseID}/{emailStudent}")]
        public async Task<ActionResult<CourseUser>> PostCourseUser(Guid courseID, string emailStudent)
        {

            var studentEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailStudent);

            var course = await _context.Courses.Include(c => c.Teacher).FirstOrDefaultAsync(c => c.ID == courseID);

            var newCourseUser = new Models.CourseUser
            {
                ID = Guid.NewGuid(),
                Course = newCourse,
                User = newUser
            };

            await _context.CourseUsers.AddAsync(newCourseUser);
            await _context.SaveChangesAsync();

            return Ok(newCourseUser);
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

        // POST: api/v1/CourseUsers/{userID}/{courseID}
        [HttpPost("add")]
        public async Task<ActionResult<GetCourseUserDtoResponse>> PostCourseUser(AddCourseUserDto courseUsersInfo)
        {
//          The user is not authenticated (there is no token provided or the token is incorrect)
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

        /*
        // POST: api/CourseUsers
        [HttpPost]
        public async Task<ActionResult<CourseUser>> PostCourseUser(CourseUser courseUser)
        {
            _context.CourseUsers.Add(courseUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourseUser", new { id = courseUser.ID }, courseUser);
        }
        */

        // GET: api/CourseUsers/5
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

        // PUT: api/CourseUsers/5
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

        // POST: api/CourseUsers
        /*
        [HttpPost]
        public async Task<ActionResult<CourseUser>> PostCourseUser(CourseUser courseUser)
        {
            _context.CourseUsers.Add(courseUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourseUser", new { id = courseUser.ID }, courseUser);
        }
        */

        // DELETE: api/CourseUsers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseUser(Guid id)
        {
            var courseUser = await _context.CourseUsers.FindAsync(id);
            if (courseUser == null)
            {
                return NotFound();
            }

            _context.CourseUsers.Remove(courseUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseUserExists(Guid id)
        {
            return _context.CourseUsers.Any(e => e.ID == id);
        }
    }
}