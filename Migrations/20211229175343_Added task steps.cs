using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedtasksteps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ExpertTaskID",
                table: "Tasks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Step",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Step",
                table: "Tasks");
        }
    }
}
