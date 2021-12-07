namespace patools.Errors
{
    public class UnauthorizedUserResponse<T> : Response<T>
    {
        public UnauthorizedUserResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.UnauthorizedUser,"The user is not authorized");
        }

        public UnauthorizedUserResponse(string message):base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.UnauthorizedUser,message);
        }
    }
    
    public class UnauthorizedUserResponse : UnauthorizedUserResponse<object>
    {
        public UnauthorizedUserResponse():base()
        {
        }

        public UnauthorizedUserResponse(string message):base(message)
        {
        }
    }
}