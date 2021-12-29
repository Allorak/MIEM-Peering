using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RespondentTypes
    {
        [EnumMember(Value = "author")]
        Author = 0,
        [EnumMember(Value = "peer")]
        Peer = 1
    }
}