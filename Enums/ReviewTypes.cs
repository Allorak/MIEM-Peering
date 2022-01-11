using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ReviewTypes
    {
        [EnumMember(Value = "doubleBlind")]
        DoubleBlind=0,
        [EnumMember(Value = "singleBlind")]
        SingleBlind=1,
        [EnumMember(Value = "open")]
        Open=2
    }
}