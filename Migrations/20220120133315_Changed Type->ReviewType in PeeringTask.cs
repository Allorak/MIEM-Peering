using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class ChangedTypeReviewTypeinPeeringTask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Tasks",
                newName: "ReviewType");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReviewType",
                table: "Tasks",
                newName: "Type");
        }
    }
}
