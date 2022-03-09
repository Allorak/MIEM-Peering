namespace patools.Dtos.Lti
{
    public class CreateLtiTaskDto
    {
        public string source_id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public bool return_user_data { get; set; }
        public string type { get; set; } = "LTI_1p0";
        public string url { get; set; }
    }
}