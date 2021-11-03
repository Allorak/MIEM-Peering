using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class ChangedDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Subject_SubjectName",
                table: "Courses");

            migrationBuilder.DropTable(
                name: "Subject");

            migrationBuilder.DropIndex(
                name: "IX_Courses_SubjectName",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "SubjectName",
                table: "Courses");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "TEXT",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "Subject",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Courses");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubjectName",
                table: "Courses",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subject",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subject", x => x.Name);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Courses_SubjectName",
                table: "Courses",
                column: "SubjectName");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Subject_SubjectName",
                table: "Courses",
                column: "SubjectName",
                principalTable: "Subject",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
