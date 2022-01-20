using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum GraphTypes
    {
        [EnumMember(Value = "finalGrades")]
        FinalGrades = 0,
        [EnumMember(Value = "criteria")]
        Criteria = 1
    }
}