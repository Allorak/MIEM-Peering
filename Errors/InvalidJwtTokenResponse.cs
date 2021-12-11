namespace patools.Errors
{
    public class InvalidJwtTokenResponse<T> : Response<T>
    {
        public InvalidJwtTokenResponse() : base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,"The jwt token provided is invalid");
        }
    }
    
    public class InvalidJwtTokenResponse : InvalidJwtTokenResponse<object>
    {
        public InvalidJwtTokenResponse() : base()
        {}
    }
}