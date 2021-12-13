using System;
using System.Threading.Tasks;
using patools.Dtos.Submission;

namespace patools.Services.Submissions
{
    public interface ISubmissionsService
    {
        Task<Response<string>> AddSubmission(AddSubmissionDto submission);
    }
}