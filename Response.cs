namespace patools
{
    public class Response
    {
        public bool Success { get; private set; }
        public object Payload { get; private set; }
        public string Message { get; private set; }

        public Response(object payload)
        {
           Success = true;
           Payload = payload;
           Message = null;
        }

        public Response(bool success, string message)
        { 
            Success = success;
            Payload = null;
            Message = message;
        }

        public Response(bool success, object payload, string message)
        {
            Success = success;
            Payload = payload;
            Message = message;
        }
    }

}