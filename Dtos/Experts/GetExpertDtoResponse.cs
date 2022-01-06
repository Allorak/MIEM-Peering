namespace patools.Dtos.Experts
{
    public class GetExpertDtoResponse
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public int TasksComplete { get; set; }
        public int TasksAssigned { get; set; }
    }
}