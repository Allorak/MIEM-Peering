using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Subgroups
    {
        [EnumMember(Value = "first")]
        First = 1,
        [EnumMember(Value = "second")]
        Second = 2
    }
}