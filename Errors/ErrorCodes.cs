namespace patools.Errors
{
    public enum ErrorCodes
    {
        Exception = -2,
        Unknown = -1,
        Request = 1,
        Response = 2,
        NoAccess = 100,
        BadRequestData = 101,
        OperationError = 103,
        UserAlreadyRegistered = 104,
        UnauthorizedUser = 105
    }
}