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

            if(!db.Experts.Any())
                db.Experts.AddRange(CreateFakeExperts(db));
            db.SaveChanges();

            if(!db.Submissions.Any())
                db.Submissions.AddRange(CreateFakeSubmissions(db));
            db.SaveChanges();

            if(!db.Answers.Any())
                db.Answers.AddRange(CreateFakeAnswers(db));
            db.SaveChanges();

            if(!db.SubmissionPeers.Any())
                db.SubmissionPeers.AddRange(CreateFakeSubmissionPeers(db));
            db.SaveChanges();
        }

        private static List<User> CreateFakeUsers()
        {
            var users = new List<User>
            {
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Моисеев Михаил Teacher",
                    Role = UserRoles.Teacher,
                    Email = "mvmoiseev@miem.hse.ru",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/1066/1066463.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Моисеев Михаил Student",
                    Role = UserRoles.Student,
                    Email = "mvmoiseev@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/201/201818.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Моисеев Михаил Expert",
                    Role = UserRoles.Teacher,
                    Email = "mvmoiseev2@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/4737/4737012.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Юсупов Мухаммад Teacher",
                    Role = UserRoles.Teacher,
                    Email = "mayusupov@miem.hse.ru",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/1066/1066463.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Юсупов Мухаммад Student",
                    Role = UserRoles.Student,
                    Email = "name.name.98gm@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/201/201818.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Юсупов Мухаммад Expert",
                    Role = UserRoles.Student,
                    Email = "peering@auditory.ru",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/4737/4737012.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Семенов Артем Teacher",
                    Role = UserRoles.Teacher,
                    Email = "bit194hse@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/1066/1066463.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Семенов Артем Student",
                    Role = UserRoles.Student,
                    Email = "aosemenov_1@miem.hse.ru",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/201/201818.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Семенов Артем Expert",
                    Role = UserRoles.Teacher,
                    Email = "avarus.space@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/4737/4737012.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Кинтана Хосе Teacher",
                    Role = UserRoles.Teacher,
                    Email = "joseaquintana1@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/1066/1066463.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Кинтана Хосе Student",
                    Role = UserRoles.Student,
                    Email = "alejandroleon0998@gmail.com",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/201/201818.png"
                },
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Кинтана Хосе Expert",
                    Role = UserRoles.Student,
                    Email = "jquintanaleon@miem.hse.ru",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/4737/4737012.png"
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
                    Description = "ООП предоставляет возможность создавать объекты, которые объединяют свойства и поведение в самостоятельный союз, который затем можно многоразово использовать.",
                    CourseCode = "5d28al_8",
                    EnableCode = true,
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher && user.Email == "mvmoiseev@miem.hse.ru").First(),
                    Subject = "Программирование"
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Изучение основ линейной алгебры",
                    Description = "Линейная алгебра изучает векторные пространства и функции, которые отображают одно векторное пространство в другое.",
                    CourseCode = "7d28al_8",
                    EnableCode = true,
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher && user.Email == "mayusupov@miem.hse.ru").First(),
                    Subject = "Линейная алгебра"
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Квантовая физика",
                    Description = "Данный курс предназначен для изучения основ квантовой физики и ее влияния на окружающий мир",
                    CourseCode = "Gbda82adG",
                    EnableCode = true,
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher && user.Email == "bit194hse@gmail.com").First(),
                    Subject = "Физика"
                },
                new Course
                {
                    ID = Guid.NewGuid(),
                    Title = "Элементы математической логики",
                    Description = "Математическая логика является важнейшим элементом математического образования.",
                    CourseCode = "Gbda82adT",
                    EnableCode = true,
                    Teacher = db.Users.Where(user => user.Role == UserRoles.Teacher && user.Email == "joseaquintana1@gmail.com").First(),
                    Subject = "Дискретная математика"
                },
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
                    Description = "ООП позволяет создавать много объектов по образу и подобию другого объекта.",
                    SubmissionStartDateTime = DateTime.Now.AddMinutes(1),
                    SubmissionEndDateTime = DateTime.Now.AddMinutes(15),
                    ReviewStartDateTime = DateTime.Now.AddMinutes(20),
                    ReviewEndDateTime = DateTime.Now.AddMinutes(35),
                    /*SubmissionsToCheck = 3,*/
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First(),
                    Step = PeeringSteps.FirstStep,
                    /*ExpertTask = 
                    PeersAssigned = */
                    Type = ReviewTypes.DoubleBlind
                },
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "История изучения квантовой физики",
                    Description = "Квантовая физика была создана в первой половине XX века учёными, среди которых Макс Планк, Альберт Эйнштейн, Эрвин Шрёдингер.",
                    SubmissionStartDateTime = DateTime.Now.AddMinutes(1),
                    SubmissionEndDateTime = DateTime.Now.AddMinutes(15),
                    ReviewStartDateTime = DateTime.Now.AddMinutes(20),
                    ReviewEndDateTime = DateTime.Now.AddMinutes(35),
                    /*SubmissionsToCheck = 5,*/
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First(),
                    Step = PeeringSteps.FirstStep,
                    /*ExpertTask = 
                    PeersAssigned = */
                    Type = ReviewTypes.DoubleBlind
                },
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "Комплексные числа в линейной алгебре",
                    Description = "Комплексные числа – это упорядоченные пары действительных чисел вида (, ) x y для которых следующим образом определены понятия равенства и операции сложения и умножения.",
                    SubmissionStartDateTime = DateTime.Now.AddMinutes(1),
                    SubmissionEndDateTime = DateTime.Now.AddMinutes(15),
                    ReviewStartDateTime = DateTime.Now.AddMinutes(20),
                    ReviewEndDateTime = DateTime.Now.AddMinutes(35),
                    /*SubmissionsToCheck = 2,*/
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First(),
                    Step = PeeringSteps.FirstStep,
                    /*ExpertTask = 
                    PeersAssigned = */
                    Type = ReviewTypes.DoubleBlind
                },
                new Models.PeeringTask
                {
                    ID = Guid.NewGuid(),
                    Title = "Изучение элементов математической логики",
                    Description = "Элементы логики, стали “обязательным компонентом школьного образования, усиливающим его прикладное и практическое значение”.",
                    SubmissionStartDateTime = DateTime.Now.AddMinutes(1),
                    SubmissionEndDateTime = DateTime.Now.AddMinutes(15),
                    ReviewStartDateTime = DateTime.Now.AddMinutes(20),
                    ReviewEndDateTime = DateTime.Now.AddMinutes(35),
                    /*SubmissionsToCheck = 4,*/
                    Course = db.Courses.Where(course => course.Title == "Элементы математической логики").First(),
                    Step = PeeringSteps.FirstStep,
                    /*ExpertTask = 
                    PeersAssigned = */
                    Type = ReviewTypes.DoubleBlind
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
                    /*CoefficientPercentage = 50,*/
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "В каком веке была открыта квантовая физика",
                    Description = "Выберите правильный вариант",
                    Order = 0,
                    Required = true,
                    Type = QuestionTypes.Multiple,
                    RespondentType = RespondentTypes.Author,
                    /*CoefficientPercentage = 50,*/
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "Пример приложений",
                    Description = "Приведите пример приложений, которыми Вы пользуютесь, использующих ООП",
                    Order = 0,
                    Required = true,
                    Type = QuestionTypes.ShortText,
                    RespondentType = RespondentTypes.Author,
                    /*CoefficientPercentage = 50,*/
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First()
                },
                new Question
                {
                    ID = Guid.NewGuid(),
                    Title = "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?",
                    Description = "Выберите один вариант",
                    Order = 0,
                    Required = true,
                    Type = QuestionTypes.Multiple,
                    RespondentType = RespondentTypes.Author,
                    /*CoefficientPercentage = 50,*/
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First()
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
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    ChoiceId = 1
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XIX",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    ChoiceId = 2
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XX",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    ChoiceId = 3
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XXI",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    ChoiceId = 4
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "XVIII",
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    ChoiceId = 5
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "Пустое множество неявляется подмножеством множества А.",
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    ChoiceId = 1
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "Множество В является бесконечным.",
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    ChoiceId = 2
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "Множества A и C равны.",
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    ChoiceId = 3
                },
                new Variant
                {
                    ID = Guid.NewGuid(),
                    Response = "Множество А является подмножеством множества В.",
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    ChoiceId = 4
                },
            };

            return variants;
        }

        private static List<CourseUser> CreateFakeCourseUsers(PAToolsContext db)
        {
            var courseUsers = new List<CourseUser>
            {
                /*First Course*/
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Объектноориентрованное программирование на языке C++").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                /*Second Course*/
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Квантовая физика").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                /*Third Course*/
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Изучение основ линейной алгебры").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                /*Fourth Course*/
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Элементы математической логики").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Элементы математической логики").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Элементы математической логики").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First()
                    /*ConfidenceFactor =*/
                },
                new CourseUser
                {
                    ID = Guid.NewGuid(),
                    Course = db.Courses.Where(course => course.Title == "Элементы математической логики").First(),
                    User = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First()
                    /*ConfidenceFactor =*/
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
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First(),
                    Subgroup = Subgroups.First
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First(),
                    Subgroup = Subgroups.First
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First(),
                    Subgroup = Subgroups.First
                },
                new GroupUser
                {
                    ID = Guid.NewGuid(),
                    Group = db.Groups.First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First(),
                    Subgroup = Subgroups.First
                }
            };

            return groupUsers;
        }

        private static List<PeeringTaskUser> CreateFakeTaskUsers(PAToolsContext db)
        {
            var taskUsers = new List<PeeringTaskUser>
            {
                /*First Task (First Course)*/
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                /*First Task (Second Course)*/
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                /*First Task (Third Course)*/
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                /*First Task (Fourth Course)*/
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "mvmoiseev@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "name.name.98gm@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "aosemenov_1@miem.hse.ru").First(),
                    States = PeeringTaskStates.Assigned
                },
                new PeeringTaskUser
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    Student = db.Users.Where(user => user.Role == UserRoles.Student && user.Email == "alejandroleon0998@gmail.com").First(),
                    States = PeeringTaskStates.Assigned
                }
            };

            return taskUsers;
        }

        private static List<Expert> CreateFakeExperts(PAToolsContext db)
        {
            var experts = new List<Expert>
            {
                /*First Task (First Course)*/
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "mvmoiseev2@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    User = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "peering@auditory.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    User = db.Users.Where(user => user.Email == "peering@auditory.ru").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "avarus.space@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    User = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "jquintanaleon@miem.hse.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Польза ООП в промышленных предприятиях").First(),
                    User = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First(),
                },
                /*First Task (Second Course)*/
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "mvmoiseev2@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    User = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "peering@auditory.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    User = db.Users.Where(user => user.Email == "peering@auditory.ru").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "avarus.space@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    User = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "jquintanaleon@miem.hse.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "История изучения квантовой физики").First(),
                    User = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First(),
                },
                /*First Task (Third Course)*/
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "mvmoiseev2@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    User = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "peering@auditory.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    User = db.Users.Where(user => user.Email == "peering@auditory.ru").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "avarus.space@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    User = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "jquintanaleon@miem.hse.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Комплексные числа в линейной алгебре").First(),
                    User = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First(),
                },
                /*First Task (Fourth Course)*/
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "mvmoiseev2@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    User = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "peering@auditory.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    User = db.Users.Where(user => user.Email == "peering@auditory.ru").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "avarus.space@gmail.com",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    User = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First(),
                },
                new Expert
                {
                    ID = Guid.NewGuid(),
                    Email = "jquintanaleon@miem.hse.ru",
                    PeeringTask = db.Tasks.Where(task => task.Title == "Изучение элементов математической логики").First(),
                    User = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First(),
                }
            };

            return experts;
        }

        private static List<Submission> CreateFakeSubmissions(PAToolsContext db)
        {
            var submissions = new List<Submission>
            {
                /*First task (First Course)*/
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && taskUser.Student.Email == "mvmoiseev@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && taskUser.Student.Email == "name.name.98gm@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && taskUser.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && taskUser.Student.Email == "alejandroleon0998@gmail.com").First(),
                },
                /*First task (Second Course)*/
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "История изучения квантовой физики" && taskUser.Student.Email == "mvmoiseev@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "История изучения квантовой физики" && taskUser.Student.Email == "name.name.98gm@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "История изучения квантовой физики" && taskUser.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "История изучения квантовой физики" && taskUser.Student.Email == "alejandroleon0998@gmail.com").First(),
                },
                /*First task (Third Course)*/
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Комплексные числа в линейной алгебре" && taskUser.Student.Email == "mvmoiseev@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Комплексные числа в линейной алгебре" && taskUser.Student.Email == "name.name.98gm@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Комплексные числа в линейной алгебре" && taskUser.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Комплексные числа в линейной алгебре" && taskUser.Student.Email == "alejandroleon0998@gmail.com").First(),
                },
                /*First task (Fourth Course)*/
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Изучение элементов математической логики" && taskUser.Student.Email == "mvmoiseev@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Изучение элементов математической логики" && taskUser.Student.Email == "name.name.98gm@gmail.com").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Изучение элементов математической логики" && taskUser.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                },
                new Submission
                {
                    ID = Guid.NewGuid(),
                    PeeringTaskUserAssignment = db.TaskUsers.Where(taskUser => taskUser.PeeringTask.Title == "Изучение элементов математической логики" && taskUser.Student.Email == "alejandroleon0998@gmail.com").First(),
                },
            };

            return submissions;
        }

        private static List<Answer> CreateFakeAnswers(PAToolsContext db)
        {
            var answers = new List<Answer>
            {
                /*First task (First Course)*/
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Эссе о полезности").First(),
                    /*Value = 5,*/
                    Response = "Что такое ООП. ООП — это и ОО программирование и проектирование. Одно без другого бессмысленно чуть более чем полностью. Создано ООП для проектирования/программирования программных продуктов. Не для моделирования процессов. Не для проектирования протоколов, а именно для программных продуктов, для их реализации. Для упрощения системы, которая будет реализовывать протокол или бизнес-процесс или что-то еще."
                    /*Grade = 7*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Эссе о полезности").First(),
                    /*Value = 5,*/
                    Response = "Когда вы начинаете использовать ООП, первое что вы должны сделать — это начать использовать объектное мышление. Я уже когда-то говорил что это самая большая проблема ООП, научиться мыслить объектно очень сложно. И очень важно учиться это делать как можно раньше (GoF с аналогиями типа мост, конструктор, фасад очень в этом помогут). Используя объектное мышление, вы легко сможете проектировать сложные системы оперируя объектами и взаимодействием между ними. Т.е. ООП без объектного мышления не позволит вам начать использовать всю силу и мощь ООП."
                    /*Grade = 7*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Question = db.Questions.Where(question => question.Title == "Эссе о полезности").First(),
                    /*Value = 5,*/
                    Response = "Пойдем дальше. Итак, нам важно мыслить объектно, для того, что бы найти нужные нам абстракции объектов для решения наших задач. Если аналогии и абстракции выбраны удачно, то мы видим очень четкую картину которая позволяет нам быстро разобраться в том, что же происходит в системе. И вот тут мы начинаем вспоминать про наследование и полиморфизм. Эти два инструмента нужны для удобного масштабирования системы без дублирования кода."
                    /*Grade = 7*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Эссе о полезности").First(),
                    /*Value = 5,*/
                    Response = "Но сила этих механизмов зависит от того насколько удачные абстракции и аналогии вы выбрали. Если ваше объектное мышление не позволяет вам сформировать удобную декомпозицию объектов, то наследование и полиморфизм вам не помогут. Т.е. наследование и полиморфизм это ничто иное как инструменты, которые позволяют решить проблему масштабирования системы."
                    /*Grade = 7*/
                },
                /*First task (Second Course)*/
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "История изучения квантовой физики" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    Value = 4,
                    /*Response = "Nice work",
                    Grade = 8*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "История изучения квантовой физики" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    Value = 5,
                    /*Response = "Nice work",
                    Grade = 8*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "История изучения квантовой физики" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    Value = 1,
                    /*Response = "Nice work",
                    Grade = 8*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "История изучения квантовой физики" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "В каком веке была открыта квантовая физика").First(),
                    Value = 2,
                    /*Response = "Nice work",
                    Grade = 8*/
                },
                /*First task (Third Course)*/
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Комплексные числа в линейной алгебре" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Пример приложений").First(),
                    /*Value = 7,*/
                    Response = "OutSystems"
                    /*Grade = 9*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Комплексные числа в линейной алгебре" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Пример приложений").First(),
                    /*Value = 7,*/
                    Response = "IntelliJ IDEA"
                    /*Grade = 9*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Комплексные числа в линейной алгебре" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Question = db.Questions.Where(question => question.Title == "Пример приложений").First(),
                    /*Value = 7,*/
                    Response = "Firebase"
                    /*Grade = 9*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Комплексные числа в линейной алгебре" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "Пример приложений").First(),
                    /*Value = 7,*/
                    Response = "Claris FileMaker"
                    /*Grade = 9*/
                },
                /*First task (Fourth Course)*/
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Изучение элементов математической логики" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    Value = 4
                    /*Response = "Normal work",
                    Grade = 6*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Изучение элементов математической логики" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    Value = 1
                    /*Response = "Normal work",
                    Grade = 7*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Изучение элементов математической логики" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    Value = 3
                    /*Response = "Normal work",
                    Grade = 6*/
                },
                new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Изучение элементов математической логики" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Question = db.Questions.Where(question => question.Title == "A = {1,2,a,b} , B = {2,a} , C = {a,1,2,b}. Какое из утверждений будут верным?").First(),
                    Value = 2
                    /*Response = "Normal work",
                    Grade = 6*/
                },
            };

            return answers;
        }

        private static List<SubmissionPeer> CreateFakeSubmissionPeers(PAToolsContext db)
        {
            var submissionPeers = new List<SubmissionPeer>
            {
                /*First Task (First Course) (First Submission)*/
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "name.name.98gm@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "aosemenov_1@miem.hse.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "alejandroleon0998@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "peering@auditory.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "mvmoiseev@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First()
                },
                /*First Task (First Course) (Second Submission)*/
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "aosemenov_1@miem.hse.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "alejandroleon0998@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "peering@auditory.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "name.name.98gm@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First()
                },
                /*First Task (First Course) (Third Submission)*/
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "name.name.98gm@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "alejandroleon0998@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "peering@auditory.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "aosemenov_1@miem.hse.ru").First(),
                    Peer = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First()
                },
                /*First Task (First Course) (Fourth Submission)*/
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "name.name.98gm@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "aosemenov_1@miem.hse.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "mvmoiseev2@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "peering@auditory.ru").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "avarus.space@gmail.com").First()
                },
                new SubmissionPeer
                {
                    ID = Guid.NewGuid(),
                    Submission = db.Submissions.Where(submission => submission.PeeringTaskUserAssignment.PeeringTask.Title == "Польза ООП в промышленных предприятиях" && submission.PeeringTaskUserAssignment.Student.Email == "alejandroleon0998@gmail.com").First(),
                    Peer = db.Users.Where(user => user.Email == "jquintanaleon@miem.hse.ru").First()
                },
            };

            return submissionPeers;
        }
    }
}
