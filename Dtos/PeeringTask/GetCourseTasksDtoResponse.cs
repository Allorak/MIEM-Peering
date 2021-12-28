using System.Collections.Generic;

namespace patools.Dtos.Task
{
    public class GetCourseTasksDtoResponse
    {
        public IEnumerable<GetPeeringTaskMainInfoDtoResponse> Tasks { get; set; }
    }
}