using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SubmissionStatus
    {
        Completed = 0,
        NotCompleted = 1
    }
}