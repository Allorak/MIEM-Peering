using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class ChangedTaskandQuestionModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Tasks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RespondentType",
                table: "Questions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "RespondentType",
                table: "Questions");
        }
    }
}
