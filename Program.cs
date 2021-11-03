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

namespace patools
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            PAToolsContext db = new PAToolsContext();
            db.Database.EnsureDeleted();
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
                    Status = UserStatuses.Student,
                    Email = "mvmoiseev@miem.hse.ru",
                    Password = "12343123"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Иванов Иван",
                    Status = UserStatuses.Teacher,
                    Email = "ivanov_ivanov@gmail.com",
                    Password = "abc123**Hd_"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Афанасьев Илья Игоревич",
                    Status = UserStatuses.Student,
                    Email = "god_of_gods@mail.ru",
                    Password = "BEjbdiAYDGF(Q#cb*"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Ковалев Алексей Владимирович",
                    Status = UserStatuses.Student,
                    Email = "avkovalev@miem.hse.ru",
                    Password = "mynameisaleksey"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Силаева Виталина Игоревна",
                    Status = UserStatuses.Teacher,
                    Email = "visilaeva@edu.hse.ru",
                    ImageUrl = "https://get.wallhere.com/photo/cat-face-eyes-branches-659829.jpg",
                    Password = "jidfbv`p8fgwiuc#B@("
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
                    Teacher = db.Users.Where(user => user.Status == UserStatuses.Teacher).First(),
                    Subject = Subjects.Programming
                },
                new Course 
                {
                    ID = Guid.NewGuid(),
                    Title = "Изучение основ линейной алгебры",
                    CourseCode = "7d28al_8",
                    Teacher = db.Users.Where(user => user.Status == UserStatuses.Teacher).First(),
                    Subject = Subjects.LinearAlgebra
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Квантовая физика",
                    Description = "Данный курс предназначен для изучения основ квантовой физики и ее влияния на окружающий мир",
                    CourseCode = "Gbda82adG",
                    Teacher = db.Users.Where(user => user.Status == UserStatuses.Teacher).Skip(1).First(),
                    Subject = Subjects.Physics
                }
            };

            return courses;
        }
    
        private static List<patools.Models.Task> CreateFakeTasks(PAToolsContext db)
        {
            var tasks = new List<patools.Models.Task>
            {
                new Models.Task 
                {
                    ID = Guid.NewGuid(),
                    Title = "Польза ООП в промышленных предприятиях",
                    SubmissionsToCheck = 3,
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First()
                },
                new Models.Task 
                {
                    ID = Guid.NewGuid(),
                    Title = "История изучения квантовой физики",
                    SubmissionsToCheck = 5,
                    StartDatetime = DateTime.Now.AddDays(3),
                    CompletionDeadlineDatetime = DateTime.Now.AddDays(10),
                    CheckStartDatetime = DateTime.Now.AddDays(11),
                    CheckDeadlineDatetime = DateTime.Now.AddDays(15),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First()
                },
                new Models.Task 
                {
                    ID = Guid.NewGuid(),
                    Title = "Комплексные числа в линейной алгебре",
                    SubmissionsToCheck = 2,
                    StartDatetime = DateTime.Now.AddDays(1),
                    CompletionDeadlineDatetime = DateTime.Now.AddDays(5),
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
                    Description = "Напишите эссе длиной не менее 300 символов на тему: \"Почему ООП полезно в промышленных предприятиях?\"",
                    Type = Types.LongAnswer,
                    Task = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Description = "Приведите пример приложений, которыми Вы пользуютесь, использующих ООП",
                    Type = Types.ShortAnswer,
                    Task = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Description = "В каком веке была открыта квантовая физика",
                    Type = Types.MultipleChoices,
                    Task = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First()
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
                    Content = "XV",
                    Question = db.Questions.Where(question => question.Description == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Content = "XIX",
                    Question = db.Questions.Where(question => question.Description == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Content = "XX",
                    Question = db.Questions.Where(question => question.Description == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Content = "XXI",
                    Question = db.Questions.Where(question => question.Description == "В каком веке была открыта квантовая физика").First()
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Content = "XVIII",
                    Question = db.Questions.Where(question => question.Description == "В каком веке была открыта квантовая физика").First()
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
                    User = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Skip(1).First(),
                    User = db.Users.Where(user => user.Status == UserStatuses.Student).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.First(),
                    User = db.Users.Where(user => user.Status == UserStatuses.Student).First()
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Skip(1).First(),
                    User = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First()
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
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First(),
                    Subgroup = Subgroups.First
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).First(),
                    Subgroup = Subgroups.Second
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.Skip(1).First(),
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First(),
                    Subgroup = Subgroups.First
                }
            };

            return groupUsers;
        }
    
        private static List<TaskUser> CreateFakeTaskUsers(PAToolsContext db)
        {
            var taskUsers = new List<TaskUser> 
            {
                new TaskUser
                {
                    ID = Guid.NewGuid(),
                    Task = db.Tasks.First(),
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First(),
                    State = TaskState.Assigned
                },
                new TaskUser
                {
                    ID = Guid.NewGuid(),
                    Task = db.Tasks.First(),
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).First(),
                    State = TaskState.Checking
                },
                new TaskUser
                {
                    ID = Guid.NewGuid(),
                    Task = db.Tasks.Skip(1).First(),
                    Student = db.Users.Where(user => user.Status == UserStatuses.Student).Skip(1).First(),
                    State = TaskState.Assigned
                }
            };

            return taskUsers;
        }
    }
}
