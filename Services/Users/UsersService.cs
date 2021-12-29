using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Channels;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.User;
using patools.Enums;
using patools.Models;
using patools.Errors;
namespace patools.Services.Users
{
    public class UsersService : IUsersService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public UsersService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetNewUserDtoResponse>> AddGoogleUser(AddUserDTO newUser)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return new UserAlreadyRegisteredResponse<GetNewUserDtoResponse>();

            var user = _mapper.Map<User>(newUser);
            user.ID = Guid.NewGuid();
            await _context.Users.AddAsync(user);

            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.Email == user.Email);
            if (expert != null)
                expert.User = user;

            if (user.Role == UserRoles.Teacher)
                await CreateFakeTeacherConnections(user);

            if (user.Role == UserRoles.Student)
                await CreateFakeStudentConnections(user);
            
            await _context.SaveChangesAsync();
            return new SuccessfulResponse<GetNewUserDtoResponse>(_mapper.Map<GetNewUserDtoResponse>(user));
        }

        public async Task<Response<GetRegisteredUserDtoResponse>> GetUserProfile(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                return new InvalidGuidIdResponse<GetRegisteredUserDtoResponse>("Invalid user id");
            
            return new SuccessfulResponse<GetRegisteredUserDtoResponse>(_mapper.Map<GetRegisteredUserDtoResponse>(user));
        }

        public async Task<Response<GetUserRoleDtoResponse>> GetUserRole(GetUserRoleDtoRequest userInfo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetUserRoleDtoResponse>("Invalid user id");

            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == userInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetUserRoleDtoResponse>("Invalid task id");

            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
            {
                return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                {
                    UserRole = UserRoles.Expert
                });
            }

            switch (user.Role)
            {
                case UserRoles.Teacher when task.Course.Teacher == user:
                    return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                    {
                        UserRole = UserRoles.Teacher,
                        Step = task.Step
                    });
                case UserRoles.Teacher:
                    return new NoAccessResponse<GetUserRoleDtoResponse>("This teacher has no access to this task");
                case UserRoles.Student:
                {
                    var courseUser = await _context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (courseUser == null)
                        return new NoAccessResponse<GetUserRoleDtoResponse>("This user isn't assigned to this task");

                    return new SuccessfulResponse<GetUserRoleDtoResponse>(new GetUserRoleDtoResponse()
                    {
                        Step = task.Step,
                        UserRole = UserRoles.Student
                    });
                }
                default:
                    return new OperationErrorResponse<GetUserRoleDtoResponse>("Unknown user role");
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
        
        //TODO: Удалить на релизе
        private async Task CreateFakeTeacherConnections(User user)
        {
            Console.WriteLine("Создаем курсы");
            List<Course> courses = new List<Course>();
            for (int i = 0; i < 3; i++)
            {
                courses.Add(
                    new Course()
                    {
                        ID = Guid.NewGuid(),
                        Title = "Курс для " + user.Fullname + " #" + (i + 1),
                        Teacher = user,
                        Subject = "Предмет #"+(i+1)
                    }
                );
            }
            
            List<PeeringTask> tasks = new List<PeeringTask>();
            for (int i = 0; i < 8; i++)
            {
                tasks.Add(
                    new PeeringTask()
                    {
                        ID = Guid.NewGuid(),
                        Title = "Задание для "+user.Fullname+" #"+(i+1),
                        Course = courses[new Random().Next(3)],
                        SubmissionStartDateTime = DateTime.Now.AddDays(new Random().Next(7)),
                        SubmissionEndDateTime = DateTime.Now.AddDays(new Random().Next(7,14)),
                        ReviewStartDateTime = DateTime.Now.AddDays(new Random().Next(14,21)),
                        ReviewEndDateTime = DateTime.Now.AddDays(new Random().Next(21,28)),
                        SubmissionsToCheck = new Random().Next(5)+1
                    });
            }

            List<Question> questions = new List<Question>();
            foreach (var task in tasks)
            {
                for (int i = 0; i < 3; i++)
                {
                    questions.Add(
                        new Question()
                        {
                            ID = Guid.NewGuid(),
                            Order = i,
                            Title = "Вопрос сдачи #"+(i+1),
                            Required = new Random().Next(2) != 0,
                            Type = QuestionTypes.Text,
                            RespondentType = RespondentTypes.Author,
                            PeeringTask = task
                        });
                    
                    questions.Add(
                        new Question()
                        {
                            ID = Guid.NewGuid(),
                            Order = i,
                            Title = "Вопрос проверки #"+(i+1),
                            Required = new Random().Next(2) != 0,
                            Type = QuestionTypes.Text,
                            RespondentType = RespondentTypes.Peer,
                            PeeringTask = task
                        });
                }
            }

            await _context.Courses.AddRangeAsync(courses);
            await _context.Tasks.AddRangeAsync(tasks);
            await _context.Questions.AddRangeAsync(questions);
        }

        private async Task CreateFakeStudentConnections(User user)
        {
            Console.WriteLine("123");
            var courses = await _context.Courses.Select(c => c).ToListAsync();

            var firstCourse = courses[new Random().Next(courses.Count / 2)];
            var secondCourse = courses[new Random().Next(courses.Count / 2 + 1, courses.Count)];

            var firstCourseConnection = new CourseUser()
            {
                ID = Guid.NewGuid(),
                Course = firstCourse,
                User = user
            };
            var secondCourseConnection = new CourseUser()
            {
                ID = Guid.NewGuid(),
                Course = secondCourse,
                User = user
            };

            await _context.CourseUsers.AddAsync(firstCourseConnection);
            await _context.CourseUsers.AddAsync(secondCourseConnection);

            var firstTasks = await _context.Tasks.Where(t => t.Course == firstCourse).ToListAsync();
            var secondTasks = await _context.Tasks.Where(t => t.Course == secondCourse).ToListAsync();

            var firstTasksUser = new List<PeeringTaskUser>();
            var secondTasksUser = new List<PeeringTaskUser>();

            for (int i = 0; i < firstTasks.Count; i++)
            {
                firstTasksUser.Add(new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = firstTasks[i],
                    States = PeeringTaskStates.Assigned,
                    Student = user
                });
            }
            
            for (int i = 0; i < secondTasks.Count; i++)
            {
                secondTasksUser.Add(new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = secondTasks[i],
                    States = PeeringTaskStates.Assigned,
                    Student = user
                });
            }

            await _context.TaskUsers.AddRangeAsync(firstTasksUser);
            await _context.TaskUsers.AddRangeAsync(secondTasksUser);
        }
    }
}