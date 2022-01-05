using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using patools.Models;
using patools.Controllers;
using patools.Enums;

namespace patools
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            PAToolsContext db = new PAToolsContext();
            //db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            InitializeDB(db);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static void InitializeDB(PAToolsContext db)
        {
            if(!db.Users.Any())
                db.Users.AddRange(CreateFakeUsers());
            db.SaveChanges();

            if(!db.Groups.Any())
                db.Groups.AddRange(CreateFakeGroups());
            db.SaveChanges();

            if(!db.Courses.Any())
                db.Courses.AddRange(CreateFakeCourses(db));
            db.SaveChanges();

            if(!db.Tasks.Any())
                db.Tasks.AddRange(CreateFakeTasks(db));
            db.SaveChanges();

            if(!db.Questions.Any())
                db.Questions.AddRange(CreateFakeQuestions(db));
            db.SaveChanges();

            if(!db.Variants.Any())
                db.Variants.AddRange(CreateFakeVariants(db));
            db.SaveChanges();

            if(!db.CourseUsers.Any())
                db.CourseUsers.AddRange(CreateFakeCourseUsers(db));
            db.SaveChanges();

            if(!db.GroupUsers.Any())
                db.GroupUsers.AddRange(CreateFakeGroupUsers(db));
            db.SaveChanges();

            if(!db.TaskUsers.Any())
                db.TaskUsers.AddRange(CreateFakeTaskUsers(db));
            db.SaveChanges();
        }

        private static List<User> CreateFakeUsers()
        {
            var users = new List<User>
            {
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Моисеев Михаил",
                    Role = UserRoles.Teacher,
                    Email = "mvmoiseev@miem.hse.ru"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Иванов Иван",
                    Role = UserRoles.Teacher,
                    Email = "ivanov_ivanov@gmail.com"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Афанасьев Илья Игоревич",
                    Role = UserRoles.Student,
                    Email = "god_of_gods@mail.ru"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Ковалев Алексей Владимирович",
                    Role = UserRoles.Student,
                    Email = "avkovalev@miem.hse.ru"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Силаева Виталина Игоревна",
                    Role = UserRoles.Teacher,
                    Email = "visilaeva@edu.hse.ru",
                    ImageUrl = "https://get.wallhere.com/photo/cat-face-eyes-branches-659829.jpg"
                },
            };

            return users;
        }

        private static List<Group> CreateFakeGroups()
        {
            var groups = new List<Group>
            {
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИВ196"
                },
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИТ182"
                },
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИВ201"
                },
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИВ181"
                },
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИТ191"
                },
                new Group
                {
                    ID = Guid.NewGuid(),
                    Name = "БИТ202"
                },

            };

            return groups;
        }

        private static List<Course> CreateFakeCourses(PAToolsContext db)
        {
            Random random = new Random();
            var courses = new List<Course>
            {
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Объектноориентрованное программирование на языке C++",
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher).First(),
                    Subject = "Программирование"
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Изучение основ линейной алгебры",
                    CourseCode = "7d28al_8",
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher).First(),
                    Subject = "Линейная алгебра"
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Квантовая физика",
                    Description = "Данный курс предназначен для изучения основ квантовой физики и ее влияния на окружающий мир",
                    CourseCode = "Gbda82adG",
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher).Skip(1).First(),
                    Subject = "Физика"
                }
            };

            return courses;
        }

        private static List<patools.Models.PeeringTask> CreateFakeTasks(PAToolsContext db)
        {
            var tasks = new List<patools.Models.PeeringTask>
            {
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "Польза ООП в промышленных предприятиях",
                    SubmissionsToCheck = 3,
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First()
                },
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "История изучения квантовой физики",
                    SubmissionsToCheck = 5,
                    SubmissionStartDateTime = DateTime.Now.AddDays(3),
                    SubmissionEndDateTime = DateTime.Now.AddDays(10),
                    ReviewStartDateTime = DateTime.Now.AddDays(11),
                    ReviewEndDateTime = DateTime.Now.AddDays(15),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First()
                },
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "Комплексные числа в линейной алгебре",
                    SubmissionsToCheck = 2,
                    SubmissionStartDateTime = DateTime.Now.AddDays(1),
                    SubmissionEndDateTime = DateTime.Now.AddDays(5),
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First()
                }
            };

            return tasks;
        }

        private static List<Question> CreateFakeQuestions(PAToolsContext db)
        {
            var questions = new List<Question>
            {
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "Эссе о полезности",
                    Description = "Напишите эссе длиной не менее 300 символов на тему: \"Почему ООП полезно в промышленных предприятиях?\"",
                    Order = 0,
                    Required = true,
                    Type = QuestionTypes.Text,
                    RespondentType = RespondentTypes.Author,
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "Пример приложений",
                    Description = "Приведите пример приложений, которыми Вы пользуютесь, использующих ООП",
                    Order = 1,
                    Required = false,
                    Type = QuestionTypes.ShortText,
                    RespondentType = RespondentTypes.Author,
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "В каком веке была открыта квантовая физика",
                    Order = 0,
                    Required = true,
                    Type = QuestionTypes.Multiple,
                    RespondentType = RespondentTypes.Author,
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First()
                },

            };
            return questions;
        }

        private static List<Variant> CreateFakeVariants(PAToolsContext db)
        {
            var variants = new List<Variant>
            {
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XV",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XIX",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XX",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XXI",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XVIII",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First()
                }
            };

            return variants;
        }

        private static List<CourseUser> CreateFakeCourseUsers(PAToolsContext db)
        {
            var courseUsers = new List<CourseUser>
            {
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Skip(1).First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Skip(1).First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First()
                }
            };

            return courseUsers;
        }

        private static List<GroupUser> CreateFakeGroupUsers(PAToolsContext db)
        {
            var groupUsers = new List<GroupUser>
            {
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First(),
                    Subgroup = Subgroups.First
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).First(),
                    Subgroup = Subgroups.Second
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.Skip(1).First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First(),
                    Subgroup = Subgroups.First
                }
            };

            return groupUsers;
        }

        private static List<PeeringTaskUser> CreateFakeTaskUsers(PAToolsContext db)
        {
            var taskUsers = new List<PeeringTaskUser>
            {
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).First(),
                    States = PeeringTaskStates.Checking
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Skip(1).First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student).Skip(1).First(),
                    States = PeeringTaskStates.Assigned
                }
            };

            return taskUsers;
        }
    }
}
