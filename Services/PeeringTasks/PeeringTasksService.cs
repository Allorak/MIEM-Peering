using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Google.Apis.Util;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Question;
using patools.Dtos.SubmissionPeer;
using patools.Dtos.Task;
using patools.Dtos.User;
using patools.Dtos.Variants;
using patools.Enums;
using patools.Models;
using patools.Errors;
namespace patools.Services.PeeringTasks
{
    public class PeeringTasksService : ServiceBase, IPeeringTasksService
    {

        public PeeringTasksService(PAToolsContext context, IMapper mapper) : base(context, mapper)
        {
        }


        public async Task<Response<GetNewPeeringTaskDtoResponse>> AddTask(AddPeeringTaskDto peeringTask)
        {
            if (peeringTask.MainInfo == null)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Main info is not provided");
            if (peeringTask.AuthorForm == null)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Author form is not provided");
            if (peeringTask.PeerForm == null)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Peer form is not provided");
            if (peeringTask.Settings == null)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Settings are not provided");
            
            var course = await GetCourseById(peeringTask.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid course id");

            var teacher = await GetUserById(peeringTask.TeacherId, UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid teacher id provided");
            
            if (course.Teacher != teacher)
                return new NoAccessResponse<GetNewPeeringTaskDtoResponse>("This teacher has no access to this course");

            if (!AreDeadlinesValid(peeringTask.Settings))
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Incorrect deadlines in request");

            var initialTask = await GetInitialTask(course);
            
            PeeringTask newTask;
            if (initialTask != null)
            {
                if (initialTask.ReviewEndDateTime > DateTime.Now)
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("The initial task hasn't ended yet");
                
                newTask = await CreateCommonTask(peeringTask, course);
            }
            else
            {
                newTask = await CreateInitialTask(peeringTask, course);
            }

            if(newTask == null)
                return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>();
            
            await Context.Tasks.AddAsync(newTask);
            //TODO: Feature should be changed later

            var students = await Context.CourseUsers
                .Where(cu => cu.Course == course)
                .Select(cu => cu.User)
                .ToListAsync();

            foreach (var student in students)
            {
                var courseUser = await Context.CourseUsers
                    .FirstOrDefaultAsync(cu => cu.User == student && cu.Course == course);
                var taskUser = new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = newTask,
                    Student = student,
                    State = PeeringTaskStates.Assigned,
                    PreviousConfidenceFactor = courseUser.ConfidenceFactor ?? 0
                };
                await Context.TaskUsers.AddAsync(taskUser);
            }
            // END of TODO
            
            if (await AddQuestions(peeringTask.AuthorForm.Rubrics, newTask,RespondentTypes.Author) == false)
                return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>();
            
            if (await AddQuestions(peeringTask.PeerForm.Rubrics, newTask,RespondentTypes.Peer) == false)
                return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>();

            await Context.SaveChangesAsync();

            /*
            var delay = newTask.SubmissionEndDateTime - DateTime.Now;
            if (newTask.Step == PeeringSteps.FirstStep)
                BackgroundJob.Schedule(()=>AssignExperts(new AssignExpertsDto()
                {
                    TaskId = newTask.ID
                }), delay);
            else
                BackgroundJob.Schedule(()=>AssignPeers(new AssignPeersDto()
                {
                    TaskId = newTask.ID
                }), delay);
            */
            return new SuccessfulResponse<GetNewPeeringTaskDtoResponse>(Mapper.Map<GetNewPeeringTaskDtoResponse>(newTask));
        }

        private static bool AreDeadlinesValid(AddPeeringTaskSettingsDto settings)
        {
            if (settings.SubmissionStartDateTime == null ||
                settings.SubmissionEndDateTime == null ||
                settings.ReviewStartDateTime == null ||
                settings.ReviewEndDateTime == null)
            {
                Console.WriteLine("Deadlines can't be null");
                return false;
            }
            
            /* if (peeringTask.Settings.SubmissionStartDateTime < DateTime.Now)
            {
                Console.WriteLine("Submission start time can't be less than current time");
                return false;
            }*/
            if (settings.SubmissionStartDateTime > settings.SubmissionEndDateTime)
            {
                Console.WriteLine("Submission start time can't be greater than submission end time");
                return false;
            }
            if (settings.SubmissionEndDateTime > settings.ReviewStartDateTime)
            {
                Console.WriteLine("Submission end time can't be greater than review start time");
                return false;
            }
            if (settings.ReviewStartDateTime > settings.ReviewEndDateTime)
            {
                Console.WriteLine("Review start time can't be greater than review end time");
                return false;
            }

            return true;
        }

        private async Task<PeeringTask> CreateCommonTask(AddPeeringTaskDto taskInfo, Course course)
        {
            var task = CreateTaskBase(taskInfo, course);

            var courseStudentConnections = await Context.CourseUsers
                .Where(cu => cu.Course == course)
                .ToListAsync();

            var noConfidenceFactorStudents = courseStudentConnections
                .Where(csc => csc.ConfidenceFactor == null)
                .ToList();

            if (courseStudentConnections.Count == noConfidenceFactorStudents.Count)
            {
                Console.WriteLine("Initial task has ended but no students have confidence factor");
                return null;
            }
                
            foreach (var courseStudent in noConfidenceFactorStudents)
            {
                courseStudent.ConfidenceFactor = 0;
            }

            task.TaskType = TaskTypes.Common;
            task.GoodConfidenceBonus = taskInfo.Settings.GoodConfidenceBonus;
            task.BadConfidencePenalty = taskInfo.Settings.BadConfidencePenalty;
            
            return task;
        }

        private async Task<PeeringTask> CreateInitialTask(AddPeeringTaskDto taskInfo, Course course)
        {
            if (taskInfo.Settings.Experts == null)
            {
                Console.WriteLine("The task is initial but no experts provided");
                return null;
            }

            var task = CreateTaskBase(taskInfo, course);
            
            task.TaskType = TaskTypes.Initial;
            task.ExpertsAssigned = false;

            if (await AddExperts(taskInfo.Settings.Experts, task) == false)
            {
                Console.WriteLine("Error in adding experts");
                return null;
            }

            return task;
        }
        
        private static PeeringTask CreateTaskBase(AddPeeringTaskDto taskInfo, Course course)
        {
            return new PeeringTask
            {
                ID = Guid.NewGuid(),
                Title = taskInfo.MainInfo.Title,
                Description = taskInfo.MainInfo.Description,
                Course = course,
                SubmissionStartDateTime = taskInfo.Settings.SubmissionStartDateTime.Value,
                SubmissionEndDateTime = taskInfo.Settings.SubmissionEndDateTime.Value,
                ReviewStartDateTime = taskInfo.Settings.ReviewStartDateTime.Value,
                ReviewEndDateTime = taskInfo.Settings.ReviewEndDateTime.Value,
                SubmissionsToCheck = taskInfo.Settings.SubmissionsToCheck,
                ReviewType = taskInfo.Settings.ReviewType,
                SubmissionWeight = taskInfo.Settings.SubmissionWeight,
                ReviewWeight = taskInfo.Settings.ReviewWeight
            };
        }

        private async Task<bool> AddExperts(IEnumerable<string> expertEmails, PeeringTask task)
        {
            foreach (var email in expertEmails)
            {
                var expertUser = await GetUserByEmail(email);

                var courseUser = await GetCourseUser(expertUser, task.Course);
                if (courseUser != null)
                {
                    Console.WriteLine($"Expert {expertUser.Email} is a student of this course");
                    return false;
                }
                
                await Context.Experts.AddAsync(new Expert()
                {
                    ID = Guid.NewGuid(),
                    Email = email,
                    User = expertUser,
                    PeeringTask = task
                });
            }

            return true;
        }
        private async Task<bool> AddQuestions(IEnumerable<AddQuestionDto> questions, PeeringTask task, RespondentTypes respondentType)
        {
            foreach(var question in questions)
            {
                var newPeerQuestion = Mapper.Map<Question>(question);
                newPeerQuestion.ID = Guid.NewGuid();
                newPeerQuestion.PeeringTask = task;
                newPeerQuestion.RespondentType = respondentType;

                if (respondentType == RespondentTypes.Peer)
                {
                    if (!newPeerQuestion.Required)
                        newPeerQuestion.CoefficientPercentage = null;
                    else if (newPeerQuestion.Type == QuestionTypes.Select && question.CoefficientPercentage == null)
                    {
                        Console.WriteLine("Coefficient Percentage can't be null in a required select question");
                        return false;
                    }
                }

                if (newPeerQuestion.Type == QuestionTypes.Multiple)
                {
                    if (await AddVariants(newPeerQuestion, question.Responses) == false)
                    {
                        Console.WriteLine("Error occured while adding variants");
                        return false;
                    }
                }
                
                await Context.Questions.AddAsync(newPeerQuestion);
            }

            return true;
        }
        
        private async Task<bool> AddVariants(Question question, List<AddVariantDto> variants)
        {
            if (variants == null || variants.Count < 2)
            {
                Console.WriteLine("Not enough variants provided in multiple-type question");
                return false;
            }
            
            var variantIds = new List<int>();
            foreach (var newVariant in variants.Select(variant => new Variant()
            {
                ID = Guid.NewGuid(),
                Response = variant.Response,
                Question = question,
                ChoiceId = variant.Id
            }))
            {
                if (variantIds.Contains(newVariant.ChoiceId))
                {
                    Console.WriteLine("Incorrect choice id provided");
                    return false;
                }
                
                variantIds.Add(newVariant.ChoiceId);
                await Context.Variants.AddAsync(newVariant);
            }

            return true;
        }
        
        public async Task<Response<string>> AssignPeers(AssignPeersDto peersInfo)
        {
            var startTime = DateTime.Now;
            var task = await Context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == peersInfo.TaskId);
            if (task.PeersAssigned)
                return new SuccessfulResponse<string>("Peers have been already assigned");
            task.PeersAssigned = true;
            await Context.SaveChangesAsync();
            var submissions = await Context.Submissions
                .Where(s => s.PeeringTaskUserAssignment.PeeringTask == task)
                .Include(s => s.PeeringTaskUserAssignment)
                .Include(s => s.PeeringTaskUserAssignment.Student)
                .OrderBy(s => s.PeeringTaskUserAssignment.Student.ID)
                .ToListAsync();

            if (submissions.Count == 0)
                return new SuccessfulResponse<string>("No submissions for this task");

            var peers = submissions
                .Select(s => s.PeeringTaskUserAssignment.Student)
                .OrderBy(u => u.ID)
                .ToList();

            var submissionsToCheck = Math.Min(task.SubmissionsToCheck, submissions.Count - 1);
            task.SubmissionsToCheck = submissionsToCheck;
            var submissionPeers = new List<SubmissionPeer>();
            for (var i = 0; i < submissions.Count; i++)
            {
                for (var j = 0; j < submissionsToCheck; j++)
                {
                    var submissionPeer = new SubmissionPeer()
                    {
                        Peer = peers[i],
                        Submission = submissions[(i+j+1)%peers.Count]
                    };
                    submissionPeers.Add(submissionPeer);
                }
            }

            submissionPeers.AddRange(submissions.Select(submission => 
                new SubmissionPeer() {ID = Guid.NewGuid(), Peer = task.Course.Teacher, Submission = submission}));

            await Context.SubmissionPeers.AddRangeAsync(submissionPeers);
            await Context.SaveChangesAsync();
            var endTime = DateTime.Now;
            return new SuccessfulResponse<string>($"Result: Peers assigned successfully for the task with id {peersInfo.TaskId} " +
                                                  $"| Time: {(endTime-startTime).TotalMilliseconds} ms"+
                                                  $"| Peers: {peers.Count}"+
                                                  $"| SubmissionsPerPeer: {submissionsToCheck}"+
                                                  $"| TotalSubmissionPeers: {submissionPeers.Count}");
        }

        public async Task<Response<string>> AssignExperts(AssignExpertsDto expertsInfo)
        {
            var startTime = DateTime.Now;
            var task = await Context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == expertsInfo.TaskId);
            switch (task.ExpertsAssigned)
            {
                case null:
                    return new SuccessfulResponse<string>("This is a second-step task");
                case true:
                    return new SuccessfulResponse<string>("Experts have been already assigned");
            }
            task.ExpertsAssigned = true;
            await Context.SaveChangesAsync();
            var experts = await Context.Experts
                .Include(e => e.User)
                .Where(e => e.PeeringTask == task)
                .ToListAsync();
            

            var unregisteredExperts = experts.Where(e => e.User == null).ToList();
            Context.Experts.RemoveRange(unregisteredExperts);
            await Context.SaveChangesAsync();
            var registeredExperts = experts.Where(e => e.User != null).ToList();
           
            if (registeredExperts.Count == 0)
                return new SuccessfulResponse<string>("No experts registered for this task");
            
            var submissions = await Context.Submissions
                .Where(s => s.PeeringTaskUserAssignment.PeeringTask == task)
                .Include(s => s.PeeringTaskUserAssignment)
                .Include(s => s.PeeringTaskUserAssignment.Student)
                .OrderBy(s => s.PeeringTaskUserAssignment.Student.ID)
                .ToListAsync();
            
            if (submissions.Count == 0)
                return new SuccessfulResponse<string>("No submissions for this task");
            var submissionPeers = new List<SubmissionPeer>();
            var submissionsPerExpert = 0;
            for (var i = 0; i < submissions.Count; i++)
            {
                if (i % registeredExperts.Count == 0)
                    submissionsPerExpert++;
                submissionPeers.Add(new SubmissionPeer()
                {
                    ID = Guid.NewGuid(),
                    Peer = registeredExperts[i % registeredExperts.Count].User,
                    Submission = submissions[i]
                });
            }

            await Context.SubmissionPeers.AddRangeAsync(submissionPeers);
            await Context.SaveChangesAsync();
            var endTime = DateTime.Now;
            return new SuccessfulResponse<string>($"Result: Experts assigned successfully for the task with id {task.ID} " +
                                                  $"| Time: {(endTime-startTime).TotalMilliseconds} ms"+
                                                  $"| Experts: {registeredExperts.Count}"+
                                                  $"| SubmissionsPerExpert: {submissionsPerExpert}"+
                                                  $"| TotalSubmissionPeers: {submissionPeers.Count}");
        }

        public async Task<Response<GetPeeringTaskOverviewDtoResponse>> GetTaskOverview(GetPeeringTaskOverviewDtoRequest taskInfo)
        {
            var user = await GetUserById(taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetPeeringTaskOverviewDtoResponse>("Invalid user id provided");

            var task = await GetTaskById(taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskOverviewDtoResponse>("Invalid task id provided");

            var response = new GetPeeringTaskOverviewDtoResponse();
            switch (user.Role)
            {
                case {} when await IsExpertUser(user,task):
                    response = await GetExpertTaskOverview(user,task);
                    break;
                case UserRoles.Teacher:
                    if (task.Course.Teacher != user)
                        return new NoAccessResponse<GetPeeringTaskOverviewDtoResponse>(
                            "This teacher has no access to the course");
                    response = await GetTeacherTaskOverview(task);
                    break;
                case UserRoles.Student:
                    response = await GetStudentTaskOverview(user,task);
                    if (response == null)
                        return new OperationErrorResponse<GetPeeringTaskOverviewDtoResponse>();
                    break;
            }

            response.Deadlines = GetTaskDeadlines(task);
            response.TaskType = task.TaskType;

            return new SuccessfulResponse<GetPeeringTaskOverviewDtoResponse>(response);
        }
        private GetPeeringTaskDeadlinesDtoResponse GetTaskDeadlines(PeeringTask task)
        {
            return Mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);
        }
        private async Task<GetPeeringTaskOverviewDtoResponse> GetExpertTaskOverview(User expert, PeeringTask task)
        {
            var assignedSubmissions = await GetAssignedSubmissions(expert, task);
            var reviewedSubmissions = await GetReviewedSubmissions(assignedSubmissions);

            return new GetPeeringTaskOverviewDtoResponse()
            {
                AssignedSubmissions = task.ReviewStartDateTime < DateTime.Now
                    ? assignedSubmissions.Count
                    : null,
                ReviewedSubmissions = task.ReviewStartDateTime < DateTime.Now
                    ? reviewedSubmissions.Count
                    : null
            };
        }
        private async Task<GetPeeringTaskOverviewDtoResponse> GetTeacherTaskOverview(PeeringTask task)
        {
            var taskStudents = await GetTaskUserAssignments(task);
            var taskUsers = await GetTaskUserAssignments(task);
            var submissions = await GetSubmissionsForTask(taskUsers);
            var submissionPeers = await GetSubmissionPeerAssignments(submissions);
            var reviews = await GetTaskReviews(submissionPeers);

            return new GetPeeringTaskOverviewDtoResponse()
            {
                Statistics = new GetPeeringTaskStatisticsDtoResponse()
                {
                    TotalSubmissions = task.SubmissionStartDateTime < DateTime.Now
                        ? taskUsers.Count
                        : null,
                    Submissions = task.SubmissionStartDateTime < DateTime.Now
                        ? submissions.Count
                        : null,
                    TotalReviews = task.ReviewStartDateTime < DateTime.Now
                        ? submissionPeers.Count
                        : null,
                    Reviews = task.ReviewStartDateTime < DateTime.Now
                        ? reviews.Count
                        : null
                },
                Grades = task.ReviewEndDateTime < DateTime.Now
                    ? GetFinalGrades(taskStudents)
                    : null,
                CurrentConfidenceFactors = task.TaskType == TaskTypes.Common
                    ? GetPreviousConfidenceFactors(taskStudents)
                    : null,
                ConfidenceFactors = task.ReviewEndDateTime < DateTime.Now
                    ? GetNextConfidenceFactors(taskStudents)
                    : null,
                ReviewType = task.ReviewType
            };
        }
        
        private async Task<GetPeeringTaskOverviewDtoResponse> GetStudentTaskOverview(User student, PeeringTask task)
        {
            var taskUser = await GetTaskUser(student, task);
            if (taskUser == null)
            {
                Console.WriteLine("This student has no access to this task");
                return null;
            }

            var submission = await GetSubmission(taskUser);
            
            var confidenceFactors = new GetPeeringTaskConfidenceFactorsDtoResponse()
            {
                Before = task.TaskType == TaskTypes.Initial ? null : taskUser.PreviousConfidenceFactor,
                After = task.ReviewEndDateTime > DateTime.Now ? null : taskUser.NextConfidenceFactor
            };

            var assignedSubmissions = await GetAssignedSubmissions(student, task);
            var reviewedSubmissions = await GetReviewedSubmissions(assignedSubmissions);


            return new GetPeeringTaskOverviewDtoResponse()
            {

                AssignedSubmissions = task.ReviewStartDateTime < DateTime.Now
                    ? assignedSubmissions.Count
                    : null,
                ReviewedSubmissions = task.ReviewStartDateTime < DateTime.Now
                    ? reviewedSubmissions.Count
                    : null,
                SubmissionStatus = task.SubmissionStartDateTime < DateTime.Now
                    ? submission != null
                    : null,
                StudentGrades = submission != null
                    ? new GetPeeringTaskStudentGradesDtoResponse()
                    {
                        MinGrade = MinPossibleGrade,
                        MaxGrade = MaxPossibleGrade,
                        Coordinates = task.ReviewStartDateTime < DateTime.Now
                            ? await GetReviewsCoordinates(await GetSubmissionReviews(submission))
                            : null
                    }
                    : null,
                StudentConfidenceFactors = confidenceFactors
            };
        }
        private async Task<List<SubmissionPeer>> GetAssignedSubmissions(User peer, PeeringTask task)
        {
            return  await Context.SubmissionPeers
                .Where(sp => sp.Peer == peer && sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
        }
        private async Task<List<Review>> GetReviewedSubmissions(IEnumerable<SubmissionPeer> assignedSubmissions)
        {
            return await Context.Reviews
                .Where(r => assignedSubmissions.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();
        }
        
        private async Task<List<GetPeeringTaskCoordinatesDtoResponse>> GetReviewsCoordinates(IEnumerable<Review> reviews)
        {
            var coordinates = new List<GetPeeringTaskCoordinatesDtoResponse>();
            var index = 0;
            foreach (var review in reviews)
            {
                var peer = review.SubmissionPeerAssignment.Peer;
                var task = review.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask;

                var expert = await Context.Experts
                    .FirstOrDefaultAsync(e => e.User == peer && e.PeeringTask == task);

                var resultReview = new GetPeeringTaskCoordinatesDtoResponse();
                switch (peer.Role)
                {
                    case { } when expert != null:
                        resultReview.Reviewer = ReviewerTypes.Expert;
                        resultReview.Name = "Эксперт";
                        break;
                    case UserRoles.Student:
                        resultReview.Reviewer = ReviewerTypes.Peer;
                        if (task.ReviewType != ReviewTypes.Open)
                            resultReview.Name = $"Аноним #{index++}";
                        break;
                    case UserRoles.Teacher:
                        resultReview.Reviewer = ReviewerTypes.Teacher;
                        resultReview.Name = task.Course.Teacher.Fullname;
                        break;
                }

                resultReview.Value = review.Grade;

                coordinates.Add(resultReview);
            }

            return coordinates;
        }
        
        public async Task<Response<GetCourseTasksDtoResponse>> GetTeacherCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            
            var teacher = await Context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid teacher id");
           
            var course = await Context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var expert = await Context.Experts.FirstOrDefaultAsync(x => x.User == teacher && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            if(course.Teacher != teacher)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This teacher has no access to the course");

            var tasks = await Context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => Mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                .ToListAsync();
        
            return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
            {
                Tasks = tasks
            });

        }
        
        public async Task<Response<GetCourseTasksDtoResponse>> GetStudentCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            var course = await Context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var student = await Context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid user id");

            var expert = await Context.Experts.FirstOrDefaultAsync(x => x.User == student && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            
            var courseUserConnection = await Context.CourseUsers
                .FirstOrDefaultAsync(x => x.User == student && x.Course == course);
        
            if (courseUserConnection == null)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This user is not assigned to this course");
            
            var tasks = await Context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => Mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                .ToListAsync();

            return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
            {
                Tasks = tasks
            });

        }

        public async Task<List<GetPeeringTaskMainInfoDtoResponse>> GetExpertCourseTasks(Expert expert, Course course)
        {
            var tasks = new List<GetPeeringTaskMainInfoDtoResponse>();
            if(expert!=null)
                tasks.AddRange(await Context.Experts
                    .Where(x => x == expert && x.PeeringTask.Course == course)
                    .Select(x => Mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x.PeeringTask))
                    .ToListAsync());
            return tasks;
        }

        public async Task<Response<GetAuthorFormDtoResponse>> GetAuthorForm(GetAuthorFormDtoRequest taskInfo)
        {
            var task = await Context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid task id");
            
            var user = await Context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid user id");

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser =
                        await Context.TaskUsers.FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (taskUser == null)
                        return new NoAccessResponse<GetAuthorFormDtoResponse>("This task is not assigned to this user");
                    if (task.SubmissionEndDateTime < DateTime.Now)
                        return new OperationErrorResponse<GetAuthorFormDtoResponse>("The deadline has already passed");
                    if (task.SubmissionStartDateTime > DateTime.Now)
                        return new OperationErrorResponse<GetAuthorFormDtoResponse>("Submissioning hasn't started yet");
                    break;
                }
                case UserRoles.Teacher when task.Course.Teacher != user:
                    return new NoAccessResponse<GetAuthorFormDtoResponse>("This teacher has no access to the task");
            }

            var questions = Context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Author)
                .OrderBy(q => q.Order);

            var resultQuestions = new List<GetAuthorQuestionDtoResponse>();
            foreach (var question in questions)
            {
                var resultQuestion = Mapper.Map<GetAuthorQuestionDtoResponse>(question);
                resultQuestion.QuestionId = question.ID;
                if (question.Type == QuestionTypes.Multiple)
                {
                    var variants = await Context.Variants
                        .Where(v => v.Question == question)
                        .Select(v => new GetVariantDtoResponse()
                        {
                            Id = v.ChoiceId,
                            Response = v.Response
                        })
                        .OrderBy(v => v.Id)
                        .ToListAsync();
                    resultQuestion.Responses = variants;
                }
                resultQuestions.Add(resultQuestion);
            }

            return new SuccessfulResponse<GetAuthorFormDtoResponse>(new GetAuthorFormDtoResponse()
            {
                Rubrics = resultQuestions
            });
        }

        public async Task<Response<GetPeerFormDtoResponse>> GetPeerForm(GetPeerFormDtoRequest taskInfo)
        {
            var task = await Context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeerFormDtoResponse>("Invalid task id provided");
            var user = await Context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetPeerFormDtoResponse>("Invalid user id provided");
            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            
            switch (user.Role)
            {
                case {} when expert!= null:
                    break;
                case UserRoles.Teacher when task.Course.Teacher != user:
                    return new NoAccessResponse<GetPeerFormDtoResponse>("This teacher has no access to this course");
                case UserRoles.Student:
                    var taskUser = await Context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.PeeringTask == task && tu.Student == user);
                    if (taskUser == null)
                        return new NoAccessResponse<GetPeerFormDtoResponse>("This task is not assigned to this user");
                    if (task.ReviewEndDateTime < DateTime.Now)
                        return new OperationErrorResponse<GetPeerFormDtoResponse>("The deadline has already passed");
                    if (task.ReviewStartDateTime > DateTime.Now)
                        return new OperationErrorResponse<GetPeerFormDtoResponse>("Reviewing hasn't started yet");
                    break;
            }
            
            var questions = Context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Peer)
                .OrderBy(q => q.Order);
            
            var resultQuestions = new List<GetPeerQuestionDtoResponse>();
            foreach (var question in questions)
            {
                var resultQuestion = Mapper.Map<GetPeerQuestionDtoResponse>(question);
                resultQuestion.QuestionId = question.ID;
                if (question.Type == QuestionTypes.Multiple)
                {
                    var variants = await Context.Variants
                        .Where(v => v.Question == question)
                        .Select(v => new GetVariantDtoResponse()
                        {
                            Id = v.ChoiceId,
                            Response = v.Response
                        })
                        .OrderBy(v => v.Id)
                        .ToListAsync();
                    resultQuestion.Responses = variants;
                }
                resultQuestions.Add(resultQuestion);
            }

            return new SuccessfulResponse<GetPeerFormDtoResponse>(new GetPeerFormDtoResponse()
            {
                Rubrics = resultQuestions
            });
        }

        public async Task<Response<GetTaskDeadlineDtoResponse>> GetTaskSubmissionDeadline(GetTaskDeadlineDtoRequest taskInfo)
        {
            var user = await Context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid user id provided");

            var task = await Context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid task id provided");

            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
                return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                {
                    State = GetTaskSubmissionDeadlineState(task)
                });

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser = await Context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (taskUser == null)
                        return new NoAccessResponse<GetTaskDeadlineDtoResponse>(
                            "This student is not assigned to this task");
                    return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                    {
                        State = GetTaskSubmissionDeadlineState(task)
                    });
                }
                case UserRoles.Teacher when task.Course.Teacher != user:
                    return new NoAccessResponse<GetTaskDeadlineDtoResponse>("This teacher has no access to this task");
                case UserRoles.Teacher:
                    return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                    {
                        State = GetTaskSubmissionDeadlineState(task)
                    });
                default:
                    return new OperationErrorResponse<GetTaskDeadlineDtoResponse>("Incorrect user role stored in token");
            }
        }

        public async Task<Response<GetTaskDeadlineDtoResponse>> GetTaskReviewDeadline(GetTaskDeadlineDtoRequest taskInfo)
        {
            var user = await Context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid user id provided");

            var task = await Context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid task id provided");

            var expert = await Context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
                return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                {
                    State = GetTaskReviewDeadlineState(task)
                });

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser = await Context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
                    if (taskUser == null)
                        return new NoAccessResponse<GetTaskDeadlineDtoResponse>(
                            "This student is not assigned to this task");
                    return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                    {
                        State = GetTaskReviewDeadlineState(task)
                    });
                }
                case UserRoles.Teacher when task.Course.Teacher != user:
                    return new NoAccessResponse<GetTaskDeadlineDtoResponse>("This teacher has no access to this task");
                case UserRoles.Teacher:
                    return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                    {
                        State = GetTaskReviewDeadlineState(task)
                    });
                default:
                    return new OperationErrorResponse<GetTaskDeadlineDtoResponse>("Incorrect user role stored in token");
            }
        }

        private static TaskDeadlineStates GetTaskSubmissionDeadlineState(PeeringTask task)
        {
            if (task.SubmissionStartDateTime > DateTime.Now)
                return TaskDeadlineStates.NotStarted;

            return task.SubmissionEndDateTime > DateTime.Now ? TaskDeadlineStates.Start : TaskDeadlineStates.End;
        }
        
        private static TaskDeadlineStates GetTaskReviewDeadlineState(PeeringTask task)
        {
            if (task.ReviewStartDateTime > DateTime.Now)
                return TaskDeadlineStates.NotStarted;

            return task.ReviewEndDateTime > DateTime.Now ? TaskDeadlineStates.Start : TaskDeadlineStates.End;
        }

        public async Task<Response<string>> ChangeConfidenceFactors(ChangeConfidenceFactorDto taskInfo)
        {
            var task = await GetTaskById(taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<string>("Invalid task id provided");

            var taskUsers = await GetTaskUserAssignments(task);
            
            foreach (var taskUser in taskUsers)
            {
                var student = taskUser.Student;
                Console.WriteLine($"Student Name: {student.Fullname}");
                
                var courseUser = await GetCourseUser(student,task.Course);
                if (courseUser == null)
                    return new OperationErrorResponse<string>($"Student {student.ID} has no access to the course");

                switch (task.TaskType)
                {
                    case TaskTypes.Initial when await TryCalculateInitialTaskResults(taskUser, courseUser) == false:
                        return new OperationErrorResponse<string>();
                    case TaskTypes.Common when await TryCalculateCommonTaskResults(taskUser, courseUser) == false:
                        return new OperationErrorResponse<string>();
                }
            }

            await Context.SaveChangesAsync();
            return new SuccessfulResponse<string>("Factors recalculated successfully. All grades are set");
        }

        private async Task<bool> TryCalculateInitialTaskResults(PeeringTaskUser taskUser, CourseUser courseUser)
        {
            var expertReview = await GetExpertReview(taskUser);
            var teacherReview = await GetTeacherReview(taskUser);
            var submissionGrade = teacherReview?.Grade ?? expertReview.Grade;
            var reviewGrade = await GetReviewedPercentage(taskUser) * MaxPossibleGrade;
            var confidenceFactor = await CountInitialConfidenceFactor(taskUser, submissionGrade);
            
            if (confidenceFactor == null)
            {
                Console.WriteLine("There is an error in counting initial confidence factors");
                return false;
            }
            
            courseUser.ConfidenceFactor = confidenceFactor.Value;
            taskUser.NextConfidenceFactor = confidenceFactor.Value;
            taskUser.SubmissionGrade = submissionGrade;
            taskUser.ReviewGrade = reviewGrade;
            taskUser.FinalGrade = (int) Math.Round(CalculateResultGrade(taskUser.PeeringTask, submissionGrade,reviewGrade));
       
            return true;
        }

        private static float CalculateResultGrade(PeeringTask task, float submissionGrade, float reviewGrade)
        {
            var submissionWeight = task.SubmissionWeight/100f;
            var reviewWeight = task.ReviewWeight/100f;
            return submissionGrade * submissionWeight + reviewGrade * reviewWeight;
        }

        private bool TryGetGradeComment(PeeringTaskUser taskUser, out string gradeComment)
        {
            gradeComment = string.Empty;
            
            var submissionGrade = taskUser.SubmissionGrade;
            if (submissionGrade == null)
                return false;
            
            var reviewGrade = taskUser.ReviewGrade;
            if (reviewGrade == null)
                return false;
            
            var submissionWeight = taskUser.PeeringTask.SubmissionWeight;
            var reviewWeight = taskUser.PeeringTask.ReviewWeight;

            var floatFinalGrade = submissionGrade * submissionWeight + reviewGrade * reviewWeight;
            var finalGrade = taskUser.FinalGrade;
            if (finalGrade == null)
                return false;
            
            gradeComment = $"{submissionGrade:f2}*{submissionWeight:f2} + {reviewGrade:f2}*{reviewWeight:f2} = {floatFinalGrade:f2} -> {finalGrade}";
            return true;
        }

        private async Task<bool> TryCalculateCommonTaskResults(PeeringTaskUser taskUser, CourseUser courseUser)
        {
            var confidenceFactor = await CountNewConfidenceFactor(taskUser) ?? taskUser.PreviousConfidenceFactor;
            courseUser.ConfidenceFactor = confidenceFactor;
            taskUser.NextConfidenceFactor = confidenceFactor;
            Console.WriteLine($"Confidence factor before task: {taskUser.PreviousConfidenceFactor}");
            Console.WriteLine($"Confidence factor after task: {taskUser.NextConfidenceFactor}");
            return true;
        }
        public async Task<Response<GetPerformanceTableDtoResponse>> GetPerformanceTable(GetPerformanceTableDtoRequest taskInfo)
        {
            var teacher = await Context.Users
                .FirstOrDefaultAsync(u => u.ID == taskInfo.TeacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid teacher id provided");

            var task = await Context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid task id provided");

            if (teacher != task.Course.Teacher)
                return new NoAccessResponse<GetPerformanceTableDtoResponse>(
                    "This teacher isn't the teacher of this course");
            
            var taskStudents = await Context.TaskUsers
                .Include(tu => tu.Student)
                .Where(tu => tu.PeeringTask == task)
                .OrderBy(tu => tu.Student)
                .ToListAsync();

            var resultStudents = new List<GetStudentPerformanceDtoResponse>();
            foreach (var taskUser in taskStudents)
            {
                resultStudents.Add(await GetStudentPerformance(taskUser,teacher));
            }

            return new SuccessfulResponse<GetPerformanceTableDtoResponse>(new GetPerformanceTableDtoResponse()
            {
                Students = resultStudents
            });
        }

        private async Task<GetStudentPerformanceDtoResponse> GetStudentPerformance(PeeringTaskUser taskUser, User teacher)
        {
            var studentInfo = new GetStudentPerformanceDtoResponse()
            {
                Fullname = taskUser.Student.Fullname,
                ImageUrl = taskUser.Student.ImageUrl,
                PreviousConfidenceFactor = taskUser.PreviousConfidenceFactor
            };

            var submission = await Context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
            studentInfo.Submitted = submission != null;
            if (!studentInfo.Submitted)
                return studentInfo;

            

            
            var submissionPeers = await Context.SubmissionPeers
                .Where(sp => sp.Submission == submission && sp.Peer != teacher)
                .ToListAsync();

            var reviews = await Context.Reviews
                .Where(r => submissionPeers.Contains(r.SubmissionPeerAssignment))
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .ToListAsync();

            var teacherReview = await Context.Reviews.FirstOrDefaultAsync(r => 
                r.SubmissionPeerAssignment.Peer == teacher
                && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser);
            studentInfo.TeacherReviewed = teacherReview != null;

            if (taskUser.PeeringTask.SubmissionEndDateTime < DateTime.Now)
            {
                var submissionsAssignedToStudent = await Context.SubmissionPeers
                    .Where(sp =>
                        sp.Peer == taskUser.Student &&
                        sp.Submission.PeeringTaskUserAssignment.PeeringTask == taskUser.PeeringTask)
                    .ToListAsync();

                studentInfo.AssignedSubmissions = submissionsAssignedToStudent.Count;
                studentInfo.ReviewedSubmissions = await Context.Reviews
                    .CountAsync(r => submissionsAssignedToStudent.Contains(r.SubmissionPeerAssignment));
            }
            
            if (taskUser.PeeringTask.ReviewEndDateTime < DateTime.Now)
            {
                studentInfo.NextConfidenceFactor = taskUser.NextConfidenceFactor;
                studentInfo.FinalGrade = taskUser.FinalGrade;
            }
            
            if (taskUser.PeeringTask.TaskType != TaskTypes.Common) 
                return studentInfo;

            if (taskUser.PeeringTask.ReviewEndDateTime < DateTime.Now)
                studentInfo.ReviewQuality = await GetReviewQuality(taskUser.PeeringTask.Course, reviews);
            return studentInfo;
        }

        private async Task<ConfidenceFactorQualities?> GetReviewQuality(Course course, IEnumerable<Review> reviews)
        {
            var confidenceFactorsSum = 0f;
            var reviewersAmount = 0;
            foreach (var review in reviews)
            {
                var courseUser = await Context.CourseUsers.FirstOrDefaultAsync(cu =>
                    cu.Course == course && cu.User == review.SubmissionPeerAssignment.Peer);
                if (courseUser.ConfidenceFactor != null)
                {
                    reviewersAmount++;
                    confidenceFactorsSum += courseUser.ConfidenceFactor.Value;
                }
            }

            if (reviewersAmount == 0)
                return null;
            
            var averageConfidenceFactor = confidenceFactorsSum/reviewersAmount;
            return averageConfidenceFactor switch
            {
                < BadConfidenceFactorBorder => ConfidenceFactorQualities.Bad,
                < DecentConfidenceFactorBorder => ConfidenceFactorQualities.Decent,
                _ => ConfidenceFactorQualities.Good
            };
        }

        private async Task<Review> GetExpertReview(PeeringTaskUser taskUser)
        {
            var task = taskUser.PeeringTask;

            var expertUsers = await GetExpertUsersForTask(task);
            var expertReview = await Context.Reviews
                    .Include(r =>r.SubmissionPeerAssignment.Peer)
                    .FirstOrDefaultAsync(r =>
                        r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser
                        && expertUsers.Contains(r.SubmissionPeerAssignment.Peer));
            return expertReview;
        }

        private async Task<Review> GetTeacherReview(PeeringTaskUser taskUser)
        {
            return await Context.Reviews.FirstOrDefaultAsync(r => 
                    r.SubmissionPeerAssignment.Peer == taskUser.PeeringTask.Course.Teacher
                    && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser);
        }
        private async Task<float?> CountInitialConfidenceFactor(PeeringTaskUser taskUser, float grade)
        {
            var reviewsError = await CalculateReviewsError(taskUser);
            if (reviewsError == null)
            {
                Console.WriteLine("Error in calculating reviews error");
                return null;
            }
            var resultConfidenceFactor = await GetReviewedPercentage(taskUser)*((1 - reviewsError.Value)*MaxPossibleGrade + grade)/(2*MaxPossibleGrade);
            Console.WriteLine($"Result confidence factor: {resultConfidenceFactor}");
            return resultConfidenceFactor;
        }

        private async Task<float?> CalculateReviewsError(PeeringTaskUser taskUser)
        {
            var task = taskUser.PeeringTask;
            var student = taskUser.Student;
            var studentReviews = await GetReviewsByPeer(task,student);

            var error = 0f;
            
            foreach (var studentReview in studentReviews)
            {
                var reviewTaskUser = studentReview.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment;
                var expertReview = await GetExpertReview(reviewTaskUser);
                var teacherReview = await GetTeacherReview(reviewTaskUser);
                
                if (expertReview == null && teacherReview == null)
                {
                    Console.WriteLine("Neither expert nor teacher has reviewed this submission");
                    return null;
                }
                
                var studentAnswers = await GetReviewSelectAnswers(studentReview);
                var masterAnswers = teacherReview != null
                    ? await GetReviewSelectAnswers(teacherReview)
                    : await GetReviewSelectAnswers(expertReview);
                var normalizedError = CalculateAnswersNormalizedError(studentAnswers, masterAnswers);
                if (normalizedError == null)
                {
                    Console.WriteLine("There was an error, counting errors");
                    return null;
                }
                error += normalizedError.Value;
            }

            var resultError = error / studentReviews.Count;
            Console.WriteLine($"Result Error: {resultError}");
            return resultError;
        }

        private static bool AreAnswersValid(Answer answer, Answer masterAnswer)
        {
            if (answer.Value == null || masterAnswer.Value == null)
            {
                Console.WriteLine("There is an error in database - select answer value is null");
                return false;
            }
            if (answer.Question != masterAnswer.Question)
            {
                Console.WriteLine("There is an error in database - answers are not the same");
                return false;
            }
            if (answer.Question.CoefficientPercentage == null)
            {
                Console.WriteLine("There is an error in database - select peer question has no coefficientPercentage");
                return false;
            }
            if (answer.Question.MinValue == null)
            {
                Console.WriteLine("There is an error in database - select peer question has no minValue");
                return false;
            }
            if (answer.Question.MaxValue == null)
            {
                Console.WriteLine("There is an error in database - select peer question has no maxValue");
                return false;
            }
            return true;
        }

        private static float? CalculateAnswersNormalizedError(List<Answer> answers, List<Answer> masterAnswers)
        {
            if (answers.Count != masterAnswers.Count)
            {
                Console.WriteLine("Incorrect amount of answers");
                return null;
            }

            var error = 0f;
            var maxError = 0f;
            for (var i = 0; i < answers.Count; i++)
            {
                if (AreAnswersValid(answers[i], masterAnswers[i]) == false)
                {
                    Console.WriteLine("Answers are not valid");
                    return null;
                }

                var question = answers[i].Question;
                var normalizingFactor = question.CoefficientPercentage.Value / 100f;
                var answerValuesDifference = Math.Abs(answers[i].Value.Value - masterAnswers[i].Value.Value);
                Console.WriteLine($"Answers difference: {answerValuesDifference}");
                Console.WriteLine($"Normalizing factor: {normalizingFactor}");
                error += answerValuesDifference * normalizingFactor;
                maxError += (question.MaxValue.Value - question.MinValue.Value) * normalizingFactor;

            }
            Console.WriteLine($"Error: {error}");
            Console.WriteLine($"Max Error: {maxError}");
            Console.WriteLine($"Normalized Error: {error/maxError}");
            return error/maxError;
        }

        private async Task<float?> CountNewConfidenceFactor(PeeringTaskUser taskUser)
        {
            var reviews = await GetTaskUserReviews(taskUser);
            if (reviews.Count == 0)
                return null;

            var confidenceFactorsSum = 0f;
            var submissionGrade = 0f;
            foreach (var review in reviews)
            {
                var peerConfidenceFactor = await GetPeerConfidenceFactor(review.SubmissionPeerAssignment.Peer, taskUser.PeeringTask.Course);
                if (peerConfidenceFactor == null)
                    return null;
                submissionGrade += review.Grade * peerConfidenceFactor.Value;
                confidenceFactorsSum += peerConfidenceFactor.Value;
            }
            submissionGrade /= confidenceFactorsSum;
            var reviewGrade = await GetReviewedPercentage(taskUser) * 100;
            var finalGrade = CalculateResultGrade(taskUser.PeeringTask, submissionGrade, reviewGrade);

            var previousConfidenceFactor = taskUser.PreviousConfidenceFactor;
            if (GetConfidenceFactorQuality(previousConfidenceFactor) == ConfidenceFactorQualities.Bad)
                finalGrade -= taskUser.PeeringTask.BadConfidencePenalty.Value;
            else if (GetConfidenceFactorQuality(previousConfidenceFactor) == ConfidenceFactorQualities.Good)
                finalGrade += taskUser.PeeringTask.GoodConfidenceBonus.Value;
            
            var newConfidenceFactor = taskUser.PreviousConfidenceFactor * MaxPossibleGrade;
            newConfidenceFactor += finalGrade;
            newConfidenceFactor /= (2*MaxPossibleGrade);

            taskUser.SubmissionGrade = submissionGrade;
            taskUser.ReviewGrade = reviewGrade;
            taskUser.FinalGrade = (int) Math.Round(finalGrade);
            Console.WriteLine($"Submission grade: {submissionGrade}");
            Console.WriteLine($"Review grade: {reviewGrade}");
            Console.WriteLine($"Final grade: {taskUser.FinalGrade}");
            return newConfidenceFactor;
        }

        private static ConfidenceFactorQualities GetConfidenceFactorQuality(float confidenceFactor)
        {
            return confidenceFactor switch
            {
                < BadConfidenceFactorBorder => ConfidenceFactorQualities.Bad,
                < DecentConfidenceFactorBorder => ConfidenceFactorQualities.Decent,
                _ => ConfidenceFactorQualities.Good
            };
        }
        private async Task<float> GetReviewedPercentage(PeeringTaskUser taskUser)
        {
            var assignedSubmissions = await Context.SubmissionPeers
                .Where(sp => sp.Peer == taskUser.Student
                             && sp.Submission.PeeringTaskUserAssignment.PeeringTask == taskUser.PeeringTask)
                .ToListAsync();

            var reviewedSubmissions = await Context.Reviews
                .Where(r => assignedSubmissions.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();

            return reviewedSubmissions.Count * 1f / assignedSubmissions.Count;
        }
    }
}