using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum QuestionTypes
    {
        [EnumMember(Value = "text")]
        Text = 0,
        [EnumMember(Value = "shortText")]
        ShortText = 1,
        [EnumMember(Value = "multiple")]
        MultipleChoices = 2,
        [EnumMember(Value = "select")]
        Select = 3
    }
}