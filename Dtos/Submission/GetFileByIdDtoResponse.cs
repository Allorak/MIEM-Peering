namespace patools.Dtos.Submission
{
    public class GetFileByIdDtoResponse
    {
        public byte[] FileContents { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}