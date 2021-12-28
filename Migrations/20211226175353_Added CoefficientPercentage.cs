using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class AddedCoefficientPercentage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Tasks_TaskID",
                table: "Questions");

            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_TaskUsers_TaskUserAssignmentID",
                table: "Submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskUsers_Tasks_TaskID",
                table: "TaskUsers");

            migrationBuilder.RenameColumn(
                name: "TaskID",
                table: "TaskUsers",
                newName: "PeeringTaskID");

            migrationBuilder.RenameIndex(
                name: "IX_TaskUsers_TaskID",
                table: "TaskUsers",
                newName: "IX_TaskUsers_PeeringTaskID");

            migrationBuilder.RenameColumn(
                name: "TaskUserAssignmentID",
                table: "Submissions",
                newName: "PeeringTaskUserAssignmentID");

            migrationBuilder.RenameIndex(
                name: "IX_Submissions_TaskUserAssignmentID",
                table: "Submissions",
                newName: "IX_Submissions_PeeringTaskUserAssignmentID");

            migrationBuilder.RenameColumn(
                name: "TaskID",
                table: "Questions",
                newName: "PeeringTaskID");

            migrationBuilder.RenameIndex(
                name: "IX_Questions_TaskID",
                table: "Questions",
                newName: "IX_Questions_PeeringTaskID");

            migrationBuilder.AddColumn<float>(
                name: "CoefficientPercentage",
                table: "Questions",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Tasks_PeeringTaskID",
                table: "Questions",
                column: "PeeringTaskID",
                principalTable: "Tasks",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_TaskUsers_PeeringTaskUserAssignmentID",
                table: "Submissions",
                column: "PeeringTaskUserAssignmentID",
                principalTable: "TaskUsers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskUsers_Tasks_PeeringTaskID",
                table: "TaskUsers",
                column: "PeeringTaskID",
                principalTable: "Tasks",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Tasks_PeeringTaskID",
                table: "Questions");

            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_TaskUsers_PeeringTaskUserAssignmentID",
                table: "Submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskUsers_Tasks_PeeringTaskID",
                table: "TaskUsers");

            migrationBuilder.DropColumn(
                name: "CoefficientPercentage",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "PeeringTaskID",
                table: "TaskUsers",
                newName: "TaskID");

            migrationBuilder.RenameIndex(
                name: "IX_TaskUsers_PeeringTaskID",
                table: "TaskUsers",
                newName: "IX_TaskUsers_TaskID");

            migrationBuilder.RenameColumn(
                name: "PeeringTaskUserAssignmentID",
                table: "Submissions",
                newName: "TaskUserAssignmentID");

            migrationBuilder.RenameIndex(
                name: "IX_Submissions_PeeringTaskUserAssignmentID",
                table: "Submissions",
                newName: "IX_Submissions_TaskUserAssignmentID");

            migrationBuilder.RenameColumn(
                name: "PeeringTaskID",
                table: "Questions",
                newName: "TaskID");

            migrationBuilder.RenameIndex(
                name: "IX_Questions_PeeringTaskID",
                table: "Questions",
                newName: "IX_Questions_TaskID");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Tasks_TaskID",
                table: "Questions",
                column: "TaskID",
                principalTable: "Tasks",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_TaskUsers_TaskUserAssignmentID",
                table: "Submissions",
                column: "TaskUserAssignmentID",
                principalTable: "TaskUsers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskUsers_Tasks_TaskID",
                table: "TaskUsers",
                column: "TaskID",
                principalTable: "Tasks",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
