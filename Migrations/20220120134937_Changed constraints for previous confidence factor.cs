using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Changedconstraintsforpreviousconfidencefactor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "PreviousConfidenceFactor",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "REAL",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "PreviousConfidenceFactor",
                table: "TaskUsers",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "REAL");
        }
    }
}
