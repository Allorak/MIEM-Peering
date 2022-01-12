using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PeeringTaskStates
    {
        [EnumMember(Value = "assigned")]
        Assigned = 0,
        [EnumMember(Value = "notChecked")]
        NotChecked = 1,
        [EnumMember(Value = "checked")]
        Checked = 2
    }
}