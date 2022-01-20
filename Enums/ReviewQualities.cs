using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ReviewQualities
    {
        [EnumMember(Value = "bad")]
        Bad = 0,
        [EnumMember(Value = "decent")]
        Decent = 1,
        [EnumMember(Value = "good")]
        Good = 2
    }
}