using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace patools.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRoles
    {
        [EnumMember(Value = "Student")]
        Student = 0,
        [EnumMember(Value = "Teacher")]
        Teacher = 1,
        [EnumMember(Value = "Expert")]
        Expert = 2
    }
}