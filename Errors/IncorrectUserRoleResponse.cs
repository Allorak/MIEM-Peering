namespace patools.Errors
{
    public class IncorrectUserRoleResponse<T> : Response<T>
    {
        public IncorrectUserRoleResponse():base()
        {
            Success = false;
            Payload = default(T);
            Error = new Error(ErrorCodes.NoAccess,"Incorrect user role for the execution of the command");
        }
    }
    
    public class IncorrectUserRoleResponse : IncorrectUserRoleResponse<object>
    {
        public IncorrectUserRoleResponse() : base()
        {}
    }
}