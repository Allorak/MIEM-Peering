namespace patools.Dtos.Task
{
    public class GetTaskOverviewDTO
    {
        public GetTaskStatisticsDTO Statistics { get; set; }
        public GetTaskDeadlinesDTO Deadlines { get; set; }
        public float[] Grades { get; set; }
    }
}