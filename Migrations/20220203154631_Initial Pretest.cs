using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class InitialPretest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Fullname = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    CourseCode = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    EnableCode = table.Column<bool>(type: "boolean", nullable: false),
                    TeacherID = table.Column<Guid>(type: "uuid", nullable: true),
                    Subject = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Courses_Users_TeacherID",
                        column: x => x.TeacherID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GroupUsers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupID = table.Column<Guid>(type: "uuid", nullable: true),
                    StudentID = table.Column<Guid>(type: "uuid", nullable: true),
                    Subgroup = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupUsers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_GroupUsers_Groups_GroupID",
                        column: x => x.GroupID,
                        principalTable: "Groups",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupUsers_Users_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseUsers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseID = table.Column<Guid>(type: "uuid", nullable: true),
                    UserID = table.Column<Guid>(type: "uuid", nullable: true),
                    ConfidenceFactor = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseUsers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_CourseUsers_Courses_CourseID",
                        column: x => x.CourseID,
                        principalTable: "Courses",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseUsers_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SubmissionStartDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    SubmissionEndDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ReviewStartDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ReviewEndDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    SubmissionsToCheck = table.Column<int>(type: "integer", nullable: false),
                    CourseID = table.Column<Guid>(type: "uuid", nullable: true),
                    TaskType = table.Column<int>(type: "integer", nullable: false),
                    ExpertsAssigned = table.Column<bool>(type: "boolean", nullable: true),
                    PeersAssigned = table.Column<bool>(type: "boolean", nullable: false),
                    ReviewType = table.Column<int>(type: "integer", nullable: false),
                    ReviewWeight = table.Column<int>(type: "integer", nullable: false),
                    SubmissionWeight = table.Column<int>(type: "integer", nullable: false),
                    GoodConfidenceBonus = table.Column<float>(type: "real", nullable: true),
                    BadConfidencePenalty = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Tasks_Courses_CourseID",
                        column: x => x.CourseID,
                        principalTable: "Courses",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Experts",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PeeringTaskID = table.Column<Guid>(type: "uuid", nullable: true),
                    UserID = table.Column<Guid>(type: "uuid", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Required = table.Column<bool>(type: "boolean", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    RespondentType = table.Column<int>(type: "integer", nullable: false),
                    MinValue = table.Column<int>(type: "integer", nullable: true),
                    MaxValue = table.Column<int>(type: "integer", nullable: true),
                    CoefficientPercentage = table.Column<float>(type: "real", nullable: true),
                    PeeringTaskID = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Questions_Tasks_PeeringTaskID",
                        column: x => x.PeeringTaskID,
                        principalTable: "Tasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TaskUsers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    PeeringTaskID = table.Column<Guid>(type: "uuid", nullable: true),
                    StudentID = table.Column<Guid>(type: "uuid", nullable: true),
                    State = table.Column<int>(type: "integer", nullable: false),
                    FinalGrade = table.Column<float>(type: "real", nullable: true),
                    SubmissionGrade = table.Column<float>(type: "real", nullable: true),
                    ReviewGrade = table.Column<float>(type: "real", nullable: true),
                    PreviousConfidenceFactor = table.Column<float>(type: "real", nullable: false),
                    NextConfidenceFactor = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskUsers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TaskUsers_Tasks_PeeringTaskID",
                        column: x => x.PeeringTaskID,
                        principalTable: "Tasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskUsers_Users_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Variants",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Response = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    QuestionID = table.Column<Guid>(type: "uuid", nullable: true),
                    ChoiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Variants", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Variants_Questions_QuestionID",
                        column: x => x.QuestionID,
                        principalTable: "Questions",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    PeeringTaskUserAssignmentID = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Submissions_TaskUsers_PeeringTaskUserAssignmentID",
                        column: x => x.PeeringTaskUserAssignmentID,
                        principalTable: "TaskUsers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubmissionPeers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmissionID = table.Column<Guid>(type: "uuid", nullable: true),
                    PeerID = table.Column<Guid>(type: "uuid", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmissionPeerAssignmentID = table.Column<Guid>(type: "uuid", nullable: true),
                    Grade = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Reviews_SubmissionPeers_SubmissionPeerAssignmentID",
                        column: x => x.SubmissionPeerAssignmentID,
                        principalTable: "SubmissionPeers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmissionID = table.Column<Guid>(type: "uuid", nullable: true),
                    ReviewID = table.Column<Guid>(type: "uuid", nullable: true),
                    QuestionID = table.Column<Guid>(type: "uuid", nullable: true),
                    Value = table.Column<int>(type: "integer", nullable: true),
                    Response = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Answers_Questions_QuestionID",
                        column: x => x.QuestionID,
                        principalTable: "Questions",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Answers_Reviews_ReviewID",
                        column: x => x.ReviewID,
                        principalTable: "Reviews",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Answers_Submissions_SubmissionID",
                        column: x => x.SubmissionID,
                        principalTable: "Submissions",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_QuestionID",
                table: "Answers",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_ReviewID",
                table: "Answers",
                column: "ReviewID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_SubmissionID",
                table: "Answers",
                column: "SubmissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_TeacherID",
                table: "Courses",
                column: "TeacherID");

            migrationBuilder.CreateIndex(
                name: "IX_CourseUsers_CourseID",
                table: "CourseUsers",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_CourseUsers_UserID",
                table: "CourseUsers",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_PeeringTaskID",
                table: "Experts",
                column: "PeeringTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_UserID",
                table: "Experts",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_GroupUsers_GroupID",
                table: "GroupUsers",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_GroupUsers_StudentID",
                table: "GroupUsers",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_PeeringTaskID",
                table: "Questions",
                column: "PeeringTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_SubmissionPeerAssignmentID",
                table: "Reviews",
                column: "SubmissionPeerAssignmentID");

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionPeers_PeerID",
                table: "SubmissionPeers",
                column: "PeerID");

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionPeers_SubmissionID",
                table: "SubmissionPeers",
                column: "SubmissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_PeeringTaskUserAssignmentID",
                table: "Submissions",
                column: "PeeringTaskUserAssignmentID");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_CourseID",
                table: "Tasks",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_TaskUsers_PeeringTaskID",
                table: "TaskUsers",
                column: "PeeringTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_TaskUsers_StudentID",
                table: "TaskUsers",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Variants_QuestionID",
                table: "Variants",
                column: "QuestionID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "CourseUsers");

            migrationBuilder.DropTable(
                name: "Experts");

            migrationBuilder.DropTable(
                name: "GroupUsers");

            migrationBuilder.DropTable(
                name: "Variants");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "SubmissionPeers");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "TaskUsers");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
