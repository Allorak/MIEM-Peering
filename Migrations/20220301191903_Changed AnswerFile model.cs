using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class ChangedAnswerFilemodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Filename",
                table: "AnswerFiles",
                newName: "FileName");

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "AnswerFiles",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "AnswerFiles");

            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "AnswerFiles",
                newName: "Filename");
        }
    }
}
