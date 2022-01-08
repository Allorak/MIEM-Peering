using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Renamedfieldsinanswermodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Review",
                table: "Answers",
                newName: "Response");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Response",
                table: "Answers",
                newName: "Review");
        }
    }
}
