using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class FixedVariantmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Variants",
                newName: "Response");

            migrationBuilder.AddColumn<int>(
                name: "ChoiceId",
                table: "Variants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChoiceId",
                table: "Variants");

            migrationBuilder.RenameColumn(
                name: "Response",
                table: "Variants",
                newName: "Content");
        }
    }
}
