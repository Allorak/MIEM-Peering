using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedreviews : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Answers");

            migrationBuilder.AddColumn<Guid>(
                name: "ReviewID",
                table: "Answers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "TEXT", nullable: false),
                    SubmissionPeerAssignmentID = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Review_SubmissionPeers_SubmissionPeerAssignmentID",
                        column: x => x.SubmissionPeerAssignmentID,
                        principalTable: "SubmissionPeers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_ReviewID",
                table: "Answers",
                column: "ReviewID");

            migrationBuilder.CreateIndex(
                name: "IX_Review_SubmissionPeerAssignmentID",
                table: "Review",
                column: "SubmissionPeerAssignmentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Review_ReviewID",
                table: "Answers",
                column: "ReviewID",
                principalTable: "Review",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Review_ReviewID",
                table: "Answers");

            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.DropIndex(
                name: "IX_Answers_ReviewID",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "ReviewID",
                table: "Answers");

            migrationBuilder.AddColumn<int>(
                name: "Grade",
                table: "Answers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
