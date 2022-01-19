using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class RenamedSteptoTaskType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Step",
                table: "Tasks",
                newName: "TaskType");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaskType",
                table: "Tasks",
                newName: "Step");
        }
    }
}
