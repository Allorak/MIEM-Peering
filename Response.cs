namespace patools
{
    public class Error
    {
        public int Code { get; set; }
        public string? Message { get; set; }

        public Error(int code)
        {
            Code = code;
        }

        public Error(int code, string message)
        {
            Code = code;
            Message = message;
        }
    }
    public class Response<T>
    {
        public bool Success { get; set; }
        public T Payload { get; set; }
        public Error Error { get; set; }
    }
}