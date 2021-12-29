using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PeeringSteps
    {
        [EnumMember(Value = "firstStep")]
        FirstStep = 1,
        [EnumMember(Value = "secondStep")]
        SecondStep = 2
    }
}