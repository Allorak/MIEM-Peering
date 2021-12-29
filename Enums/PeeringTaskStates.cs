using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PeeringTaskStates
    {
        [EnumMember(Value = "assigned")]
        Assigned = 0,
        [EnumMember(Value = "checking")]
        Checking = 1,
        [EnumMember(Value = "graded")]
        Graded = 2
    }
}