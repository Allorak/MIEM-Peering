using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Submission;
using patools.Dtos.SubmissionPeer;
using patools.Enums;

namespace patools.Services.Submissions
{
    public interface ISubmissionsService
    {
        Task<Response<GetNewSubmissionDtoResponse>> AddSubmission(AddSubmissionDto submission);

        Task<Response<GetAllSubmissionsMainInfoDtoResponse>> GetSubmissions(
            GetAllSubmissionsMainInfoDtoRequest taskInfo);

        Task<Response<GetSubmissionDtoResponse>> GetSubmission(GetSubmissionDtoRequest submissionInfo);

        Task<Response<SubmissionStatus>> GetSubmissionStatus(CanSubmitDto submissionInfo);

    }
}