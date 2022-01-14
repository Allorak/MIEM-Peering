using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class AddedexpertsAssignedfield : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Tasks_ExpertTaskID",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ExpertTaskID",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ExpertTaskID",
                table: "Tasks");

            migrationBuilder.AddColumn<bool>(
                name: "ExpertsAssigned",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpertsAssigned",
                table: "Tasks");

            migrationBuilder.AddColumn<Guid>(
                name: "ExpertTaskID",
                table: "Tasks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ExpertTaskID",
                table: "Tasks",
                column: "ExpertTaskID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Tasks_ExpertTaskID",
                table: "Tasks",
                column: "ExpertTaskID",
                principalTable: "Tasks",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
