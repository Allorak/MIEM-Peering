using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Models;

namespace patools.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseUsersController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public CourseUsersController(PAToolsContext context)
        {
            _context = context;
        }

        // GET: api/CourseUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseUser>>> GetCourseUsers()
        {
            var seevalues = _context.CourseUsers
                .Include(c => c.Course)
                .Include(u => u.User)
                .Select(x => new {x.ID});
                //.Select(x => new {x.Course.ID})
                //.Select(x => new {x.User.ID, x.User.Email});

            return Ok(new SuccessfulResponse(seevalues.ToList()));
        }

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
        /*[HttpPost]
        public async Task<ActionResult<CourseUser>> PostCourseUser(CourseUser courseUser)
        {
            _context.CourseUsers.Add(courseUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourseUser", new { id = courseUser.ID }, courseUser);
        }
        */

        // POST: api/CourseUsers
        [HttpPost]
        public async Task<ActionResult<CourseUser>> PostCourseUser(CourseUser courseUser)
        {
            var verify1 = _context.CourseUsers
                .Include(x => x.Course)
                .Include(u => u.User)
                .Where(x => x.User.ID == courseUser.ID);
            if(verify1.Any())
                return Ok(new FailedResponse(new Error(406, "The user is in the database")));

            return CreatedAtAction("GetCourseUser", new { id = courseUser.ID }, courseUser);
            //_context.CourseUsers.Add(courseUser);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetCourseUser", new { id = courseUser.ID }, courseUser);
        }

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