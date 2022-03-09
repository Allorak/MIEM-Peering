using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Answer;
using patools.Dtos.Submission;
using patools.Models;

namespace patools.Services.Files
{
    public interface IFilesService
    {
        public Task<List<GetAnswerFileInfoDto>> GetFilesByAnswer(Answer answer);
        public Task<Response<GetFileByIdDtoResponse>> GetAnswerFileById(GetFileByIdDtoRequest fileInfo);
    }
}