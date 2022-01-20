using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum StatisticTypes
    {
        [EnumMember(Value = "graph")]
        Graph = 0,
        [EnumMember(Value = "response")]
        Response = 1
    }
}