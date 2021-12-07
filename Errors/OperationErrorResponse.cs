namespace patools.Errors
{
    public class OperationErrorResponse<T> : Response<T>
    {
        public OperationErrorResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,"Error occured while completing the operation");
        }
        
        public OperationErrorResponse(string message):base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,message);
        }
    }
    
    public class OperationErrorResponse : OperationErrorResponse<object>
    {
        public OperationErrorResponse() : base()
        {
        }
        
        public OperationErrorResponse(string message):base(message)
        {
        }
    }
}