using System.Collections.Generic;
using patools.Dtos.User;

namespace patools.Dtos.Task
{
    public class GetPerformanceTableDtoResponse
    {
        public IEnumerable<GetStudentPerformanceDtoResponse> Students { get; set; }
    }
}