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
    public abstract class Response
    {
        public bool Success { get; protected set; }
        public object Payload { get; protected set; }
        public Error Error { get; protected set; }
    }

    public class FailedResponse : Response
    {
        public FailedResponse(Error error)
        {
            Success = false;
            Payload = null;
            Error = error;
        }
    }

    public class SuccessfulResponse : Response
    {
        public SuccessfulResponse(object payload)
        {
            Success = true;
            Payload = payload;
            Error = null;
        }
    }
}