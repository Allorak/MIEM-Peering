using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class ChangedAnswerModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Answers",
                newName: "Review");

            migrationBuilder.AddColumn<int>(
                name: "Value",
                table: "Answers",
                type: "INTEGER",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "Answers");

            migrationBuilder.RenameColumn(
                name: "Review",
                table: "Answers",
                newName: "Text");
        }
    }
}
