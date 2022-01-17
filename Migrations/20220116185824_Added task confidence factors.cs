using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedtaskconfidencefactors : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "ConfidenceFactorAfterTask",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "ConfidenceFactorBeforeTask",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfidenceFactorAfterTask",
                table: "TaskUsers");

            migrationBuilder.DropColumn(
                name: "ConfidenceFactorBeforeTask",
                table: "TaskUsers");
        }
    }
}
