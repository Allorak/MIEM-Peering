using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class AddedTaskToExperts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "State",
                table: "TaskUsers",
                newName: "States");

            migrationBuilder.CreateTable(
                name: "Experts",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PeeringTaskID = table.Column<Guid>(type: "TEXT", nullable: true),
                    UserID = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Experts_Tasks_PeeringTaskID",
                        column: x => x.PeeringTaskID,
                        principalTable: "Tasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Experts_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Experts_PeeringTaskID",
                table: "Experts",
                column: "PeeringTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_UserID",
                table: "Experts",
                column: "UserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Experts");

            migrationBuilder.RenameColumn(
                name: "States",
                table: "TaskUsers",
                newName: "State");
        }
    }
}
