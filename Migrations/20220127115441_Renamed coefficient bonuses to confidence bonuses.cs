using Microsoft.EntityFrameworkCore.Migrations;

namespace patools.Migrations
{
    public partial class Renamedcoefficientbonusestoconfidencebonuses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BadCoefficientPenalty",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "GoodCoefficientBonus",
                table: "Tasks");

            migrationBuilder.AlterColumn<float>(
                name: "SubmissionGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "REAL");

            migrationBuilder.AlterColumn<float>(
                name: "ReviewGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "REAL");

            migrationBuilder.AlterColumn<int>(
                name: "FinalGrade",
                table: "TaskUsers",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<float>(
                name: "BadConfidencePenalty",
                table: "Tasks",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "GoodConfidenceBonus",
                table: "Tasks",
                type: "REAL",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BadConfidencePenalty",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "GoodConfidenceBonus",
                table: "Tasks");

            migrationBuilder.AlterColumn<float>(
                name: "SubmissionGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "ReviewGrade",
                table: "TaskUsers",
                type: "REAL",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FinalGrade",
                table: "TaskUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

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
        }
    }
}
