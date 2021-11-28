using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Renameddeadlinesintask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartDatetime",
                table: "Tasks",
                newName: "SubmissionStartDateTime");

            migrationBuilder.RenameColumn(
                name: "CompletionDeadlineDatetime",
                table: "Tasks",
                newName: "SubmissionEndDateTime");

            migrationBuilder.RenameColumn(
                name: "CheckStartDatetime",
                table: "Tasks",
                newName: "ReviewStartDateTime");

            migrationBuilder.RenameColumn(
                name: "CheckDeadlineDatetime",
                table: "Tasks",
                newName: "ReviewEndDateTime");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SubmissionStartDateTime",
                table: "Tasks",
                newName: "StartDatetime");

            migrationBuilder.RenameColumn(
                name: "SubmissionEndDateTime",
                table: "Tasks",
                newName: "CompletionDeadlineDatetime");

            migrationBuilder.RenameColumn(
                name: "ReviewStartDateTime",
                table: "Tasks",
                newName: "CheckStartDatetime");

            migrationBuilder.RenameColumn(
                name: "ReviewEndDateTime",
                table: "Tasks",
                newName: "CheckDeadlineDatetime");
        }
    }
}
