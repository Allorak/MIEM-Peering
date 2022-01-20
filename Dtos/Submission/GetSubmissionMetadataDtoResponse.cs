using System.Collections.Generic;

namespace patools.Dtos.Submission
{
    public class GetSubmissionMetadataDtoResponse
    {
        public IEnumerable<GetStatisticDtoResponse> Statistics { get; set; }
    }
}