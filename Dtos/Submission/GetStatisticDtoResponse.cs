using System.Collections.Generic;
using patools.Dtos.Answer;
using patools.Dtos.Task;
using patools.Enums;

namespace patools.Dtos.Submission
{
    public class GetStatisticDtoResponse
    {
        public StatisticTypes StatisticType { get; set; }
        public GraphTypes? GraphType { get; set; }
        public string Title { get; set; }
        public int? MinGrade { get; set; }
        public int? MaxGrade { get; set; }
        public ReviewerTypes? Reviewer { get; set; }
        public IEnumerable<GetAnswerDtoResponse> Responses { get; set; }
        public IEnumerable<GetPeeringTaskCoordinatesDtoResponse> Coordinates { get; set; }
    }
}