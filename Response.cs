namespace patools
{
    public abstract class Response
    {
        public bool Success { get; protected set; }
        public object Payload { get; protected set; }
        public object Error { get; protected set; }
    }

    public class FailedResponse : Response
    {
        public FailedResponse(object error)
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