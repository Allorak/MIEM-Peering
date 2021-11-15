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
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly PAToolsContext _context;

        public CoursesController(PAToolsContext context)
        {
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

        // GET: api/v1/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            try
            {
                var course = _context.Courses
                    .Include(course => course.Teacher)
                    .Select(x => new {x.ID, x.Teacher.Fullname, x.Title, x.Subject, x.Description, x.Teacher.ImageUrl});
            
                return Ok(new SuccessfulResponse(course.ToList()));
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(403, "Error to get courses"))); 
            }
            
        }

        // GET: api/v1/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        // PUT: api/v1/Courses/5
        [HttpPut("{id}")]
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

        // POST: api/v1/Courses
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            var verify1 = _context.Courses.Where(x => x.Title == course.Title);
            if(verify1.Any())
                return Ok(new FailedResponse(new Error(404, "The title is already used")));

            var verify2 = _context.Courses.Where(x => x.Subject == course.Subject);
            if(verify2.Any())
                return Ok(new FailedResponse(new Error(405, "The subject is already used")));

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var course2 = _context.Courses
                .Where(x => x.ID == course.ID)
                .Select(x => new {x.ID});

            return Ok(new SuccessfulResponse(course2.ToList()));
        }

        // DELETE: api/v1/Courses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.ID == id);
        }
    }
}