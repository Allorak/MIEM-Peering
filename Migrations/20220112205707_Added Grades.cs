using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class AddedGrades : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FinalGrade",
                table: "TaskUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "Grade",
                table: "Reviews",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalGrade",
                table: "TaskUsers");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Reviews");
        }
    }
}
