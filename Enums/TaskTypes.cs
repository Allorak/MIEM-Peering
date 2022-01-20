using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TaskTypes
    {
        [EnumMember(Value = "initial")]
        Initial = 1,
        [EnumMember(Value = "common")]
        Common = 2
    }
}