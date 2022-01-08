using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedcheckforassigningpeers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PeersAssigned",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PeersAssigned",
                table: "Tasks");
        }
    }
}
