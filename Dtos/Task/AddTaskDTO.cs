namespace patools.Dtos.Task
{
    public class AddTaskDTO
    {
        public AddTaskMainInfoDTO MainInfo { get; set;}
        public AddTaskSettingsDTO Settings { get; set;}
        public AddTaskQuestionFormDTO AuthorForm { get; set;}
        public AddTaskQuestionFormDTO PeerForm { get; set;}
    }
}