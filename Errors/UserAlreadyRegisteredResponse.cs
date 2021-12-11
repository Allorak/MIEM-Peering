namespace patools.Errors
{
    public class UserAlreadyRegisteredResponse<T> : Response<T>
    {
        public UserAlreadyRegisteredResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,"The user is already registered");
        }
    }
    
    public class UserAlreadyRegisteredResponse : UserAlreadyRegisteredResponse<object>
    {
        public UserAlreadyRegisteredResponse() : base()
        {
        }
    }
}