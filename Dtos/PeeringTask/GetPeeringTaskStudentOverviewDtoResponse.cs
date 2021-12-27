namespace patools.Dtos.Task
{
    public class GetPeeringTaskStudentOverviewDtoResponse
    {
        public GetPeeringTaskDeadlinesDtoResponse Deadlines { get; set; }
        public int SubmissionsToCheck { get; set; }
        public int Reviewed { get; set; }
    }
}