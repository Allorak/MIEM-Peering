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
            
                return Ok(new SuccessfulResponse(new {message = "Got courses successfully"}));
                //return Ok(course.ToList());
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(401, "Unauthorized")));  
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
            try
            {
                _context.Courses.Add(course);
                await _context.SaveChangesAsync();
                return Ok(new SuccessfulResponse(new {message = "Course added successfully"}));
                //return CreatedAtAction("GetCourse", new { id = course.ID }, course.ID);
            }
            catch(Exception)
            {
                return Ok(new FailedResponse(new Error(401, "Unauthorized")));  
            }

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