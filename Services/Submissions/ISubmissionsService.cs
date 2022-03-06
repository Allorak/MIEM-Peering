using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        Task<Response<GetSubmissionIdDtoResponse>> GetSubmissionIdForStudents(
            GetSubmissionIdDtoRequest taskInfo);

        Task<Response<GetSubmissionDtoResponse>> GetSubmission(GetSubmissionDtoRequest submissionInfo);

        Task<Response<SubmissionStatus>> GetSubmissionStatus(CanSubmitDto submissionInfo);

        Task<Response<IEnumerable<GetSubmissionToCheckDtoResponse>>> GetChecksCatalog(GetSubmissionToCheckDtoRequest taskInfo);

        Task<Response<GetSubmissionMetadataDtoResponse>> GetSubmissionMetadata(GetSubmissionMetadataDtoRequest submissionInfo);

    }
}