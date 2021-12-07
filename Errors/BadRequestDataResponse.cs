namespace patools.Errors
{
    public class BadRequestDataResponse<T> : Response<T>
    {
        public BadRequestDataResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,"Incorrect data in the request");
        }
        
        public BadRequestDataResponse(string message):base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,message);
        }
    }
    
    public class BadRequestDataResponse : BadRequestDataResponse<object>
    {
        public BadRequestDataResponse() : base()
        {}
        
        public BadRequestDataResponse(string message):base(message)
        {}
    }
}