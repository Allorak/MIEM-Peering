namespace patools
{
    public class Response
    {
        public bool Success { get; private set; }
        public object Payload { get; private set; }
        public string FailureMessage { get; private set; }

        public Response(object payload)
        {
           Success = true;
           Payload = payload;
           FailureMessage = null;
        }

        public Response(string failureMessage)
        { 
            Success = false;
            Payload = null;
            FailureMessage = failureMessage;
        }
    }

}