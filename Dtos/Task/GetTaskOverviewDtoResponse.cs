namespace patools.Dtos.Task
{
    public class GetTaskOverviewDtoResponse
    {
        public GetTaskStatisticsDtoResponse Statistics { get; set; }
        public GetTaskDeadlinesDtoResponse Deadlines { get; set; }
        public float[] Grades { get; set; }
    }
}