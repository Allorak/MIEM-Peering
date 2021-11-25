using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Course;
using patools.Models;
using patools.Services.Courses;

namespace patools.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly ICoursesService _coursesService;

        public CoursesController(PAToolsContext context, ICoursesService coursesService)
        {
            _coursesService = coursesService;
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
        public async Task<ActionResult<List<Course>>> GetCourses()
        {
            return Ok(await _coursesService.GetAllCourses());
        }

        // GET: api/v1/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(Guid id)
        {
            return Ok(await _coursesService.GetCourseById(id));
        }

        // PUT: api/v1/Courses/5
        //Refactoring is needed
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
        public async Task<ActionResult<GetCourseDTO>> PostCourse(AddCourseDTO course)
        {
            return Ok(await _coursesService.AddCourse(course));
        }

        // DELETE: api/v1/Courses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            return Ok(await _coursesService.DeleteCourse(id));
        }

        //Should be in CourseService.cs file, Remove after refactoring
        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.ID == id);
        }
    }
}