namespace patools.Errors
{
    public class InvalidGuidIdResponse<T> : Response<T>
    {
        public InvalidGuidIdResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.BadRequestData,"The guid id provided is invalid for the execution of the command");
        }
        
        public InvalidGuidIdResponse(string message):base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.BadRequestData,message);
        }
    }
    
    public class InvalidGuidIdResponse : InvalidGuidIdResponse<object>
    {
        public InvalidGuidIdResponse(string message):base(message)
        {}
        public InvalidGuidIdResponse():base()
        {}
    }
}