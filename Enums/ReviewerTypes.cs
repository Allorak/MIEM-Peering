using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ReviewerTypes
    {
        [EnumMember(Value = "peer")]
        Peer = 0,
        [EnumMember(Value = "expert")]
        Expert = 1,
        [EnumMember(Value = "teacher")]
        Teacher = 2
    }
}