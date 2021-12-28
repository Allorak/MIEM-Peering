using System;
using patools.Errors;

namespace patools
{
    public class Response<T>
    {
        public bool Success { get; set; }
        public T Payload { get; set; }
        public Error Error { get; set; }
    }
    
    public class SuccessfulResponse<T> : Response<T>
    {
        public SuccessfulResponse(T payload)
        {
            Success = true;
            Error = null;
            Payload = payload;
        }
    }
}