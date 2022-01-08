using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class AddedSubmissionPeersConnection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SubmissionPeers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "TEXT", nullable: false),
                    SubmissionID = table.Column<Guid>(type: "TEXT", nullable: true),
                    PeerID = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubmissionPeers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SubmissionPeers_Submissions_SubmissionID",
                        column: x => x.SubmissionID,
                        principalTable: "Submissions",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubmissionPeers_Users_PeerID",
                        column: x => x.PeerID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionPeers_PeerID",
                table: "SubmissionPeers",
                column: "PeerID");

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionPeers_SubmissionID",
                table: "SubmissionPeers",
                column: "SubmissionID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubmissionPeers");
        }
    }
}
