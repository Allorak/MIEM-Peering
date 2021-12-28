namespace patools.Dtos.Task
{
    public class GetPeeringTaskTeacherOverviewDtoResponse
    {
        public GetPeeringTaskStatisticsDtoResponse Statistics { get; set; }
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public float[] Grades { get; set; }
    }
}