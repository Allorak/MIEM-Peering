#nullable enable
namespace patools.Errors
{
    public class Error
    {
        public ErrorCodes Code { get; set; }
        public string? Message { get; set; }

        public Error(ErrorCodes code)
        {
            Code = code;
        }

        public Error(ErrorCodes code, string message)
        {
            Code = code;
            Message = message;
        }
    }
}