using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Fixedmisspelling : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Review_ReviewID",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_SubmissionPeers_SubmissionPeerAssignmentID",
                table: "Review");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Review",
                table: "Review");

            migrationBuilder.RenameTable(
                name: "Review",
                newName: "Reviews");

            migrationBuilder.RenameColumn(
                name: "States",
                table: "TaskUsers",
                newName: "State");

            migrationBuilder.RenameIndex(
                name: "IX_Review_SubmissionPeerAssignmentID",
                table: "Reviews",
                newName: "IX_Reviews_SubmissionPeerAssignmentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Reviews_ReviewID",
                table: "Answers",
                column: "ReviewID",
                principalTable: "Reviews",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_SubmissionPeers_SubmissionPeerAssignmentID",
                table: "Reviews",
                column: "SubmissionPeerAssignmentID",
                principalTable: "SubmissionPeers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Reviews_ReviewID",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_SubmissionPeers_SubmissionPeerAssignmentID",
                table: "Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews");

            migrationBuilder.RenameTable(
                name: "Reviews",
                newName: "Review");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "TaskUsers",
                newName: "States");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_SubmissionPeerAssignmentID",
                table: "Review",
                newName: "IX_Review_SubmissionPeerAssignmentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Review",
                table: "Review",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Review_ReviewID",
                table: "Answers",
                column: "ReviewID",
                principalTable: "Review",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_SubmissionPeers_SubmissionPeerAssignmentID",
                table: "Review",
                column: "SubmissionPeerAssignmentID",
                principalTable: "SubmissionPeers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
