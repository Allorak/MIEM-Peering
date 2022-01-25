namespace patools.Dtos.Task
{
    public class GetPeeringTaskStatisticsDtoResponse
    {
        public int? TotalSubmissions { get; set; }
        public int? Submissions { get; set; }
        public int? TotalReviews { get; set; }
        public int? Reviews { get; set; }
    }
}