using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Renamedconfidencefactorstopreviousandnext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ConfidenceFactorBeforeTask",
                table: "TaskUsers",
                newName: "PreviousConfidenceFactor");

            migrationBuilder.RenameColumn(
                name: "ConfidenceFactorAfterTask",
                table: "TaskUsers",
                newName: "NextConfidenceFactor");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreviousConfidenceFactor",
                table: "TaskUsers",
                newName: "ConfidenceFactorBeforeTask");

            migrationBuilder.RenameColumn(
                name: "NextConfidenceFactor",
                table: "TaskUsers",
                newName: "ConfidenceFactorAfterTask");
        }
    }
}
