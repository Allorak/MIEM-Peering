namespace patools
{
    public class Error
    {
        public int Code { get; set; }
        public string? Message { get; set; }

        public Error(int code)
        {
            Code = code;
        }

        public Error(int code, string message)
        {
            Code = code;
            Message = message;
        }
    }
    public class Response<T>
    {
        public bool Success { get; set; }
        public T Payload { get; set; }
        public Error Error { get; set; }
    }

    public class UnauthorizedUserResponse : Response<object>
    {
        public UnauthorizedUserResponse():base()
        {
            Success = false;
            Payload = null;
            Error = new Error(401,"User is unauthorized");
        }
    }

    public class IncorrectUserRoleResponse : Response<object>
    {
        public IncorrectUserRoleResponse():base()
        {
            Success = false;
            Payload = null;
            Error = new Error(403,"Incorrect user role for the execution of the command");
        }
    }

    public class InvalidUserIdResponse : Response<object>
    {
        public InvalidUserIdResponse():base()
        {
            Success = false;
            Payload = null;
            Error = new Error(-10,"The authorized user id is invalid for the execution of the command");
        }
    }
}