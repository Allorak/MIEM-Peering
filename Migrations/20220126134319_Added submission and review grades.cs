using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedsubmissionandreviewgrades : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "ReviewGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "SubmissionGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewGrade",
                table: "TaskUsers");

            migrationBuilder.DropColumn(
                name: "SubmissionGrade",
                table: "TaskUsers");
        }
    }
}
