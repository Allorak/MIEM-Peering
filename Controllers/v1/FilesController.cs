using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using patools.Dtos.Submission;
using patools.Errors;
using patools.Models;
using patools.Services.Files;
using patools.Services.Submissions;

namespace patools.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly PAToolsContext _context;
        private readonly IFilesService _filesService;
        
        public FilesController(PAToolsContext context, IFilesService filesService)
        {
            _context = context;
            _filesService = filesService;
        }
        
        [HttpGet("answer-file/file={fileId:guid}")]
        public async Task<IActionResult> GetAnswerFile(Guid fileId)
        {
            if(!User.Identity.IsAuthenticated)
                return Ok(new UnauthorizedUserResponse());
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
                return Ok(new InvalidJwtTokenResponse());
            
            if(!Guid.TryParse(userIdClaim.Value, out var userId))
                return Ok(new InvalidGuidIdResponse());
            
            var result = await _filesService.GetAnswerFileById(new GetFileByIdDtoRequest()
            {
                AnswerFileId = fileId,
                UserId = userId
            });
            if (result.Success == false)
                return Ok(result);
            return File(result.Payload.FileContents, result.Payload.ContentType, result.Payload.FileName);
        }
    }
}