using System.Collections.Generic;

namespace patools.Dtos.Submission
{
    public class GetAllSubmissionsMainInfoDtoResponse
    {
        public List<GetSubmissionMainInfoDtoResponse> SubmissionsInfo { get; set; }
    }
}