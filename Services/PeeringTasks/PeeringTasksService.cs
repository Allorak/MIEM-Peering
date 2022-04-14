using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using DocumentFormat.OpenXml.ExtendedProperties;
using Google.Apis.Util;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using patools.Dtos.Lti;
using patools.Dtos.Question;
using patools.Dtos.SubmissionPeer;
using patools.Dtos.Task;
using patools.Dtos.User;
using patools.Dtos.Variants;
using patools.Enums;
using patools.Models;
using patools.Errors;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace patools.Services.PeeringTasks
{
    public class PeeringTasksService : ServiceBase, IPeeringTasksService
    {

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private const int LtiHourBreakBorder = 5;
        private const int LtiDayBreakBorder = 10;
        private const int LtiMaxTries = 15;
        public PeeringTasksService(PAToolsContext context, IMapper mapper,IHttpClientFactory httpClientFactory, Microsoft.Extensions.Configuration.IConfiguration configuration) : base(context, mapper)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
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

            if (peeringTask.Settings.LtiEnable)
            {
                newTask.LtiEnabled = true;
                var ltiInfo = await CreateLtiBridge(new CreateLtiTaskDto()
                {
                    return_user_data = true,
                    source_id = null,
                    description = null,
                    title = null,
                    url = $"{_configuration.GetSection("LTI:RedirectLink").Value}/{newTask.ID}"
                });

                if (ltiInfo == null)
                {
                    Console.WriteLine("Lti Bridge has Failed");
                }
                else
                {
                    newTask.ConsumerKey = ltiInfo.consumer_key;
                    newTask.LtiTaskId = ltiInfo.id;
                    newTask.SharedSecret = ltiInfo.shared_secret;
                }
            }

            await Context.Tasks.AddAsync(newTask);

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
            
            if (await AddQuestions(peeringTask.AuthorForm.Rubrics, newTask,RespondentTypes.Author) == false)
                return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>();
            
            if (await AddQuestions(peeringTask.PeerForm.Rubrics, newTask,RespondentTypes.Peer) == false)
                return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>();

            await Context.SaveChangesAsync();

            ScheduleAssignments(newTask);
            ScheduleConfidenceFactorsCalculation(newTask);
            return new SuccessfulResponse<GetNewPeeringTaskDtoResponse>(Mapper.Map<GetNewPeeringTaskDtoResponse>(newTask));
        }

        private async Task<NewLtiTaskResponseDto> CreateLtiBridge(CreateLtiTaskDto taskInfo)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(taskInfo),
                Encoding.UTF8,
                MediaTypeNames.Application.Json);
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _configuration.GetSection("LTI:AppToken").Value);
            var httpResponseMessage = await httpClient.PostAsync(_configuration.GetSection("LTI:CreateTaskLink").Value,content);
            if (httpResponseMessage.IsSuccessStatusCode == false)
                return null;
            var responseBody = await httpResponseMessage.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<NewLtiTaskResponseDto>(responseBody);
        }
        private void ScheduleAssignments(PeeringTask task)
        {
            var delay = task.SubmissionEndDateTime - DateTime.Now;
            if (task.TaskType == TaskTypes.Initial)
                BackgroundJob.Schedule(()=>AssignExperts(new AssignExpertsDto()
                {
                    TaskId = task.ID
                }), delay);
            else
                BackgroundJob.Schedule(()=>AssignPeers(new AssignPeersDto()
                {
                    TaskId = task.ID
                }), delay);
        }

        private void ScheduleConfidenceFactorsCalculation(PeeringTask task)
        {
            var delay = task.ReviewEndDateTime - DateTime.Now;
            BackgroundJob.Schedule(() => ChangeConfidenceFactors(new ChangeConfidenceFactorDto()
            {
                TaskId = task.ID
            }),delay);
        }

        private async Task<string> ScheduleLtiGrades(PeeringTask task)
        {
            var delay = TimeSpan.FromSeconds(10);
            var taskUsers = (await GetTaskUserAssignments(task)).Where( tu => tu.JoinedByLti);
            foreach (var taskUser in taskUsers)
            {
                if (taskUser.FinalGrade != null)
                {
                    var assignmentId = taskUser.PeeringTask.LtiTaskId;
                    if (assignmentId == null)
                        return "Wrong Task selected";
                    BackgroundJob.Schedule(() => ReturnLtiGrade(taskUser, assignmentId.Value,0), delay);
                    delay += TimeSpan.FromSeconds(5);
                }
            }
            return "Lti grades scheduled successfully";
        }

        public async Task<string> ReturnLtiGrade(PeeringTaskUser taskUser, int assignmentId, int tryCount)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    grade = taskUser.FinalGrade!=null ? taskUser.FinalGrade.Value/10 : 0,
                    user_email = taskUser.Student.Email
                }),
                Encoding.UTF8,
                MediaTypeNames.Application.Json);
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _configuration.GetSection("LTI:AppToken").Value);
            var gradeLink = _configuration.GetSection("LTI:CreateTaskLink").Value + $"/{assignmentId}/grades";
            var httpResponseMessage = await httpClient.PostAsync(gradeLink,content);
            if (httpResponseMessage.IsSuccessStatusCode)
            {
                var databaseTaskUser = await Context.TaskUsers.FirstOrDefaultAsync(tu => tu == taskUser);
                databaseTaskUser.ReceivedLtiGrade = true;
                await Context.SaveChangesAsync();
                return "Success";
            }

            if (tryCount >= LtiMaxTries) return "Failure";
            
            switch (tryCount)
            {
                case LtiHourBreakBorder:
                    BackgroundJob.Schedule(() => ReturnLtiGrade(taskUser, assignmentId, tryCount + 1),
                        TimeSpan.FromHours(1));
                    break;
                case LtiDayBreakBorder:
                    BackgroundJob.Schedule(() => ReturnLtiGrade(taskUser, assignmentId, tryCount + 1),
                        TimeSpan.FromDays(1));
                    break;
                default:
                    BackgroundJob.Schedule(() => ReturnLtiGrade(taskUser, assignmentId, tryCount + 1),
                        TimeSpan.FromSeconds(15));
                    break;
            }

            return "Failure";
        }
        private static bool AreDeadlinesValid(AddPeeringTaskSettingsDto settings)
        {
            
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
                SubmissionStartDateTime = taskInfo.Settings.SubmissionStartDateTime,
                SubmissionEndDateTime = taskInfo.Settings.SubmissionEndDateTime,
                ReviewStartDateTime = taskInfo.Settings.ReviewStartDateTime,
                ReviewEndDateTime = taskInfo.Settings.ReviewEndDateTime,
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
        
        private async Task<bool> AddVariants(Question question, ICollection<AddVariantDto> variants)
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
            var task = await GetTaskById(peersInfo.TaskId);
            if (task.PeersAssigned)
                return new SuccessfulResponse<string>("Peers have been already assigned");
            task.PeersAssigned = true;
            await Context.SaveChangesAsync();
            var submissions = await GetSubmissionsForTask(task);
            submissions = submissions.OrderBy(s => s.PeeringTaskUserAssignment.Student.ID).ToList();

            if (submissions.Count == 0)
                return new SuccessfulResponse<string>("No submissions for this task");

            var peers = submissions
                .Select(s => s.PeeringTaskUserAssignment.Student)
                .OrderBy(u => u.ID)
                .ToList();

            var submissionsToCheck = Math.Min(task.SubmissionsToCheck, submissions.Count - 1);
            task.SubmissionsToCheck = submissionsToCheck;

            var submissionPeers = CreateSubmissionPeers(submissions,peers,submissionsToCheck);
            
            var peersWithNoSubmission = await Context.TaskUsers
                .Where(tu => tu.PeeringTask == task && !peers.Contains(tu.Student))
                .Select(tu => tu.Student)
                .ToListAsync();

            submissionPeers.AddRange(CreateSubmissionPeers(submissions,peersWithNoSubmission,submissionsToCheck));

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

        private static List<SubmissionPeer> CreateSubmissionPeers(List<Submission> submissions, List<User> peers, int submissionsToCheck)
        {
            var submissionPeers = new List<SubmissionPeer>();
            for (var i = 0; i < peers.Count; i++)
            {
                for (var j = 0; j < submissionsToCheck; j++)
                {
                    submissionPeers.Add(new SubmissionPeer()
                    {
                        Peer = peers[i],
                        Submission = submissions[(i+j+1)%submissions.Count]
                    });
                }
            }

            return submissionPeers;
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
            await AssignPeers(new AssignPeersDto()
            {
                TaskId = expertsInfo.TaskId
            });
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
                    response = await GetTeacherTaskOverview(task,user);
                    break;
                case UserRoles.Student:
                    response = await GetStudentTaskOverview(user,task);
                    if (response == null)
                        return new OperationErrorResponse<GetPeeringTaskOverviewDtoResponse>();
                    break;
            }

            response.Deadlines = GetTaskDeadlines(task);
            response.TaskType = task.TaskType;
            response.Title = task.Title;
            response.Description = task.Description != string.Empty ? task.Description : null;

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
        private async Task<GetPeeringTaskOverviewDtoResponse> GetTeacherTaskOverview(PeeringTask task, User teacher)
        {
            var taskStudents = await GetTaskUserAssignments(task);
            var taskUsers = await GetTaskUserAssignments(task);
            var submissions = await GetSubmissionsForTask(taskUsers);
            var submissionPeers = await GetSubmissionPeerAssignments(submissions, teacher);
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
                ReviewType = task.ReviewType,
                SubmissionWeight = task.SubmissionWeight,
                ReviewWeight = task.ReviewWeight,
                BadConfidencePenalty = task.TaskType == TaskTypes.Common
                    ? task.BadConfidencePenalty
                    : null,
                GoodConfidenceBonus = task.TaskType == TaskTypes.Common
                    ? task.GoodConfidenceBonus
                    : null,
                LtiConsumerKey = task.LtiEnabled ? task.ConsumerKey : null,
                LtiSharedSecret = task.LtiEnabled ? task.SharedSecret : null
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
                Before = taskUser.PreviousConfidenceFactor,
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
                StudentConfidenceFactors = confidenceFactors,
                SubmissionWeight = task.SubmissionWeight,
                ReviewWeight = task.ReviewWeight,
                BadConfidencePenalty = task.TaskType == TaskTypes.Common
                    ? task.BadConfidencePenalty
                    : null,
                GoodConfidenceBonus = task.TaskType == TaskTypes.Common
                    ? task.GoodConfidenceBonus
                    : null,
                SubmissionGrade = task.ReviewEndDateTime < DateTime.Now
                    ? taskUser.SubmissionGrade
                    : null,
                ReviewGrade = task.ReviewEndDateTime < DateTime.Now
                    ? taskUser.ReviewGrade
                    : null,
                FinalGrade = task.ReviewEndDateTime < DateTime.Now
                    ? taskUser.FinalGrade
                    : null,
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
            var index = 1;
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
                        resultReview.Name = task.ReviewType != ReviewTypes.Open ? $"Аноним #{index++}" : peer.Fullname;
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
                
                var courseUser = await GetCourseUser(student,task.Course);
                if (courseUser == null)
                    return new OperationErrorResponse<string>($"Student {student.ID} has no access to the course");

                switch (task.TaskType)
                {
                    case TaskTypes.Initial :
                        if(!await TryCalculateInitialTaskResults(taskUser, courseUser))
                            Console.WriteLine("Initial confidence factor calculation failed");
                        break;
                    case TaskTypes.Common:
                        if(!await TryCalculateCommonTaskResults(taskUser, courseUser))
                            Console.WriteLine("Initial confidence factor calculation failed");
                        break;
                }
            }

            await Context.SaveChangesAsync();
            if(task.LtiEnabled)
                await ScheduleLtiGrades(task);
            return new SuccessfulResponse<string>("Factors recalculated successfully. All grades are set");
        }

        private async Task<bool> TryCalculateInitialTaskResults(PeeringTaskUser taskUser, CourseUser courseUser)
        {
            var submission = await GetSubmission(taskUser);
            var submissionGrade = 0f;
            
            if (submission is not null)
            {
                var expertReview = await GetExpertReview(taskUser);
                var teacherReview = await GetTeacherReview(taskUser);
                if (expertReview == null && teacherReview == null)
                    return false;
                submissionGrade = teacherReview?.Grade ?? expertReview.Grade;
            }
            
            var reviewedPercentage = await GetReviewedPercentage(taskUser);
            var reviewGrade =  reviewedPercentage * MaxPossibleGrade;
            
            taskUser.SubmissionGrade = submissionGrade;
            taskUser.ReviewGrade = reviewGrade;
            taskUser.FinalGrade = CalculateResultGrade(taskUser.PeeringTask, submissionGrade,reviewGrade);
            
                
            var confidenceFactor = await CountInitialConfidenceFactor(taskUser, submissionGrade);
            if (submissionGrade == 0 && reviewedPercentage == 0)
                confidenceFactor = 0;
            
            if (confidenceFactor == null)
            {
                Console.WriteLine("There is an error in counting initial confidence factors");
                return false;
            }
            
            courseUser.ConfidenceFactor = confidenceFactor.Value;
            taskUser.NextConfidenceFactor = confidenceFactor.Value;
       
            return true;
        }

        private static float CalculateResultGrade(PeeringTask task, float submissionGrade, float reviewGrade)
        {
            var submissionWeight = task.SubmissionWeight/100f;
            var reviewWeight = task.ReviewWeight/100f;
            return submissionGrade * submissionWeight + reviewGrade * reviewWeight;
        }

        private static bool TryGetGradeComment(PeeringTaskUser taskUser, out string gradeComment,float? confidenceFactor = null)
        {
            gradeComment = string.Empty;
            
            if (taskUser.PeeringTask.ReviewEndDateTime > DateTime.Now)
                return false;
            
            var submissionGrade = taskUser.SubmissionGrade;
            if (submissionGrade == null)
                return false;
            
            var reviewGrade = taskUser.ReviewGrade;
            if (reviewGrade == null)
                return false;
            
            var submissionWeight = taskUser.PeeringTask.SubmissionWeight/100f;
            var reviewWeight = taskUser.PeeringTask.ReviewWeight/100f;

            var floatFinalGrade = submissionGrade * submissionWeight + reviewGrade * reviewWeight;
            var finalGrade = taskUser.FinalGrade;
            if (finalGrade == null)
                return false;
            
            gradeComment = $"{submissionGrade:f2}*{submissionWeight:f2} + {reviewGrade:f2}*{reviewWeight:f2} = {floatFinalGrade:f2} ";
            if (taskUser.PeeringTask.TaskType == TaskTypes.Common)
            {
                if (confidenceFactor != null)
                {
                    var penalty = taskUser.PeeringTask.BadConfidencePenalty.Value;
                    var bonus = taskUser.PeeringTask.GoodConfidenceBonus.Value;
                    if (GetConfidenceFactorQuality(confidenceFactor.Value) == ConfidenceFactorQualities.Bad)
                        gradeComment += $" - {Math.Abs(penalty)} = {(floatFinalGrade + penalty):f2} ";
                    else if (GetConfidenceFactorQuality(confidenceFactor.Value) == ConfidenceFactorQualities.Good)
                        gradeComment += $" + {bonus} = {(floatFinalGrade + bonus):f2} ";
                }
            }

            gradeComment += $"-> {finalGrade:f2}";
            return true;
        }

        private static bool TryGetConfidenceComment(PeeringTaskUser taskUser, out string confidenceComment)
        {
            confidenceComment = string.Empty;
            
            if (taskUser.PeeringTask.ReviewEndDateTime > DateTime.Now)
                return false;
            
            var nextConfidenceFactor = taskUser.NextConfidenceFactor;
            if (nextConfidenceFactor == null)
                return false;
            
            var finalGrade = taskUser.FinalGrade;
            if (finalGrade == null)
                return false;
            if (taskUser.PeeringTask.TaskType == TaskTypes.Common)
            {
                var mappedConfidenceFactor = taskUser.PreviousConfidenceFactor * MaxPossibleGrade;
                confidenceComment = $"Переводим предыдущий коэффициент доверия в шкалу оценивания:{taskUser.PreviousConfidenceFactor:f2} * {MaxPossibleGrade} -> {mappedConfidenceFactor:f2}\n";
                var averagedGrade = (mappedConfidenceFactor + finalGrade) / 2;
                confidenceComment +=
                    $"Усредняем предыдущее значение с итоговой оценкой за задание: {mappedConfidenceFactor:f2} + {finalGrade:f2} / 2 -> {averagedGrade:f2}\n";
                confidenceComment +=
                    $"Переводим снова в шкалу коэффициентов: {averagedGrade:f2}/{MaxPossibleGrade} -> {nextConfidenceFactor:f2}";
                return true;
            }

            return false;
        }
        private async Task<bool> TryCalculateCommonTaskResults(PeeringTaskUser taskUser, CourseUser courseUser)
        {
            var submission = await GetSubmission(taskUser);
            var confidenceFactor = await CountNextConfidenceFactor(taskUser,submission) ?? taskUser.PreviousConfidenceFactor;
            courseUser.ConfidenceFactor = confidenceFactor;
            taskUser.NextConfidenceFactor = confidenceFactor;
            return true;
        }
        public async Task<Response<GetPerformanceTableDtoResponse>> GetPerformanceTable(GetPerformanceTableDtoRequest taskInfo)
        {
            var teacher = await GetUserById(taskInfo.TeacherId, UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid teacher id provided");

            var task = await GetTaskById(taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid task id provided");

            if (teacher != task.Course.Teacher)
                return new NoAccessResponse<GetPerformanceTableDtoResponse>(
                    "This teacher isn't the teacher of this course");

            var taskStudents = (await GetTaskUserAssignments(task))
                .OrderBy(tu => tu.Student.Fullname)
                .ToList();

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
                Email = taskUser.Student.Email,
                PreviousConfidenceFactor = taskUser.PreviousConfidenceFactor,
                JoinedByLti = taskUser.JoinedByLti,
                ReceivedLtiGrade = taskUser.ReceivedLtiGrade
            };

            var submission = await GetSubmission(taskUser);
            studentInfo.Submitted = submission != null;

            var submissionPeers = await GetSubmissionPeerAssignments(submission,teacher);

            var reviews = await GetTaskReviews(submissionPeers);

            var teacherReview = await GetTeacherReview(taskUser);
            studentInfo.TeacherReviewed = teacherReview != null;

            if (taskUser.PeeringTask.SubmissionEndDateTime < DateTime.Now)
            {
                var submissionsAssignedToStudent = await GetSubmissionPeerAssignmentsForPeer(taskUser.PeeringTask, taskUser.Student);

                studentInfo.AssignedSubmissions = submissionsAssignedToStudent.Count;
                studentInfo.ReviewedSubmissions = (await GetTaskReviews(submissionsAssignedToStudent)).Count;
            }
            
            if (taskUser.PeeringTask.ReviewEndDateTime < DateTime.Now)
            {
                studentInfo.NextConfidenceFactor = taskUser.NextConfidenceFactor;
                studentInfo.SubmissionGrade = taskUser.SubmissionGrade;
                studentInfo.ReviewGrade = taskUser.ReviewGrade;
                studentInfo.FinalGrade = taskUser.FinalGrade;
                if (TryGetGradeComment(taskUser, out var gradeComment))
                    studentInfo.GradeComment = gradeComment;
                if (TryGetConfidenceComment(taskUser, out var confidenceComment))
                    studentInfo.ConfidenceComment = confidenceComment;
            }
            
            if (taskUser.PeeringTask.TaskType != TaskTypes.Common) 
                return studentInfo;
            
            if (studentInfo.Submitted && taskUser.PeeringTask.ReviewEndDateTime < DateTime.Now)
                studentInfo.ReviewQuality = await GetReviewQuality(taskUser.PeeringTask, reviews);
            return studentInfo;
        }

        private async Task<ConfidenceFactorQualities?> GetReviewQuality(PeeringTask task, IEnumerable<Review> reviews)
        {
            var confidenceFactorsSum = 0f;
            var reviewersAmount = 0;
            var reviewsList = reviews.ToList();
            if (!reviewsList.Any())
                return ConfidenceFactorQualities.NotReviewed;
            foreach (var peer in reviewsList.Select(review => review.SubmissionPeerAssignment.Peer))
            {
                var taskUser = await Context.TaskUsers.FirstOrDefaultAsync(
                    tu => tu.Student == peer && tu.PeeringTask == task);
                reviewersAmount++;
                confidenceFactorsSum += taskUser.PreviousConfidenceFactor;
            }

            
            var averageConfidenceFactor = confidenceFactorsSum/reviewersAmount;
            return averageConfidenceFactor switch
            {
                < BadConfidenceFactorBorder => ConfidenceFactorQualities.Bad,
                < DecentConfidenceFactorBorder => ConfidenceFactorQualities.Decent,
                _ => ConfidenceFactorQualities.Good
            };
        }
        
        private async Task<float?> CountInitialConfidenceFactor(PeeringTaskUser taskUser, float grade)
        {
            var reviewsError = await CalculateReviewsError(taskUser);
            if (reviewsError == null)
            {
                Console.WriteLine("Error in calculating reviews error");
                return null;
            }

            //var submissionWeight = taskUser.PeeringTask.SubmissionWeight / 100f;
            //var reviewWeight = taskUser.PeeringTask.ReviewWeight / 100f;
            var submissionWeight = 0.2f;
            var reviewWeight = 0.8f;
            var reviewConfidence = (1 - reviewsError.Value) * MaxPossibleGrade * reviewWeight;
            var submissionConfidence = grade * submissionWeight;
            var resultConfidenceFactor = await GetReviewedPercentage(taskUser)*(reviewConfidence + submissionConfidence)/(MaxPossibleGrade);
            Console.WriteLine($"Result confidence factor: {resultConfidenceFactor}");
            return resultConfidenceFactor;
        }

        private async Task<float?> CalculateReviewsError(PeeringTaskUser taskUser)
        {
            var task = taskUser.PeeringTask;
            var student = taskUser.Student;
            var studentReviews = await GetReviewsByPeer(task,student);

            if (studentReviews.Count == 0)
                return 1;
            var error = 0f;
            
            foreach (var studentReview in studentReviews)
            {
                var reviewTaskUser = studentReview.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment;
                var expertReview = await GetExpertReview(reviewTaskUser);
                var teacherReview = await GetTeacherReview(reviewTaskUser);
                
                if (expertReview == null && teacherReview == null)
                    continue;
                
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

        private async Task<float?> CountNextConfidenceFactor(PeeringTaskUser taskUser, Submission submission)
        {
            var submissionGrade = 0f;
            var teacherReview = await GetTeacherReview(taskUser);
            if (teacherReview != null)
            {
                submissionGrade = teacherReview.Grade;
            }
            else if (submission != null)
            {
                var confidenceFactorsSum = 0f;
                var reviews = await GetTaskUserReviews(taskUser);
                if (reviews.Count == 0)
                    return null;

                foreach (var review in reviews)
                {
                    var peerConfidenceFactor = await GetPeerPreviousConfidenceFactor(review.SubmissionPeerAssignment.Peer, taskUser.PeeringTask);
                    if (peerConfidenceFactor != null)
                    {
                        submissionGrade += review.Grade * peerConfidenceFactor.Value;
                        confidenceFactorsSum += peerConfidenceFactor.Value;
                    }
                }

                if (confidenceFactorsSum != 0)
                    submissionGrade /= confidenceFactorsSum;
                else
                    submissionGrade /= reviews.Count;
            }
            var reviewGrade = await GetReviewedPercentage(taskUser) * 10;
            var finalGrade = CalculateResultGrade(taskUser.PeeringTask, submissionGrade, reviewGrade);

            var previousConfidenceFactor = taskUser.PreviousConfidenceFactor;
            if (taskUser.PeeringTask.BadConfidencePenalty == null || taskUser.PeeringTask.GoodConfidenceBonus == null)
            {
                Console.WriteLine("Bonus and penalty are null in a common-type task");
                return null;
            }
            if (GetConfidenceFactorQuality(previousConfidenceFactor) == ConfidenceFactorQualities.Bad)
                finalGrade += taskUser.PeeringTask.BadConfidencePenalty.Value;
            else if (GetConfidenceFactorQuality(previousConfidenceFactor) == ConfidenceFactorQualities.Good)
                finalGrade += taskUser.PeeringTask.GoodConfidenceBonus.Value;

            finalGrade = Math.Clamp(finalGrade, MinPossibleGrade, MaxPossibleGrade);
            
            var newConfidenceFactor = taskUser.PreviousConfidenceFactor * MaxPossibleGrade;
            newConfidenceFactor += finalGrade;
            newConfidenceFactor /= (2*MaxPossibleGrade);

            taskUser.SubmissionGrade = submissionGrade;
            taskUser.ReviewGrade = reviewGrade;
            taskUser.FinalGrade = finalGrade;
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

            if (assignedSubmissions.Count == 0)
                return 0;
            
            var reviewedSubmissions = await Context.Reviews
                .Where(r => assignedSubmissions.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();

            return reviewedSubmissions.Count * 1f / assignedSubmissions.Count;
        }
    }
}