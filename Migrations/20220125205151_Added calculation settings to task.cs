using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Addedcalculationsettingstotask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BadCoefficientPenalty",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GoodCoefficientBonus",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReviewWeight",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SubmissionWeight",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BadCoefficientPenalty",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "GoodCoefficientBonus",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ReviewWeight",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "SubmissionWeight",
                table: "Tasks");
        }
    }
}
