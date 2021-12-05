namespace patools.Errors
{
    public class NoAccessResponse<T> : Response<T>
        {
            public NoAccessResponse():base()
            {
                Success = false;
                Payload = default(T);
                Error = new Error(ErrorCodes.NoAccess,"No access for completing the operation");
            }
        
            public NoAccessResponse(string message):base()
            {
                Success = false;
                Payload = default(T);
                Error = new Error(ErrorCodes.NoAccess,message);
            }
        }
    
        public class NoAccessResponse : NoAccessResponse<object>
        {
            public NoAccessResponse() : base()
            {}
        
            public NoAccessResponse(string message):base(message)
            {}
        }
}