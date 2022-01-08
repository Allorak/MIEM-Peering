using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TaskDeadlineStates
    {
        [EnumMember(Value = "start")]
        Start = 0,
        [EnumMember(Value = "end")]
        End = 1,
        [EnumMember(Value = "notStarted")]
        NotStarted = 2
    }
}