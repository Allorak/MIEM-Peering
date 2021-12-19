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
                    .Select(x => new {x.User.ID, x.Course.Title, x.Course.Description, x.Course.CourseCode, x.Course.Subject, x.User.Fullname, x.User.Role, x.User.Email, x.User.ImageUrl});
            
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

        // POST: api/v1/CourseUsers/{userID}/{courseID}
        [HttpPost("{userID}/{courseID}")]
        public async Task<ActionResult<CourseUser>> PostCourseUser(Guid userID, Guid courseID)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userID);
            if (user == null)
                return new InvalidGuidIdResponse<string>();

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.ID == courseID);
            if (course == null)
                return new InvalidGuidIdResponse<string>();
            
            var newCourseUser = new Models.CourseUser
            {
                ID = Guid.NewGuid(),
                User = user,
                Course = course
            };

            await _context.CourseUsers.AddAsync(newCourseUser);
            await _context.SaveChangesAsync();

            return Ok(newCourseUser);
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