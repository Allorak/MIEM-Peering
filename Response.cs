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
}