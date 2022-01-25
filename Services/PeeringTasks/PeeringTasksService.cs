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
    public class PeeringTasksService : BasicService, IPeeringTasksService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;
        private const int MinPossibleGrade = 0;
        private const int MaxPossibleGrade = 10;
        private const float BadAverageConfidenceFactor = 1f/3;
        private const float DecentAverageConfidenceFactor = 2f/3;

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
            
            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.ID == peeringTask.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid course id");

            var teacher =
                await _context.Users.FirstOrDefaultAsync(u =>
                    u.ID == peeringTask.TeacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetNewPeeringTaskDtoResponse>("Invalid teacher id provided");
            
            if (course.Teacher != teacher)
                return new NoAccessResponse<GetNewPeeringTaskDtoResponse>("This teacher has no access to this course");

            if (peeringTask.Settings.SubmissionStartDateTime == null ||
                peeringTask.Settings.SubmissionEndDateTime == null ||
                peeringTask.Settings.ReviewStartDateTime == null ||
                peeringTask.Settings.ReviewEndDateTime == null)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Deadlines can't be null");
            
            // if (peeringTask.Settings.SubmissionStartDateTime < DateTime.Now)
            //     return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
            //         "Submission start time can't be less than current time");
            if (peeringTask.Settings.SubmissionStartDateTime > peeringTask.Settings.SubmissionEndDateTime)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                    "Submission start time can't be greater than submission end time");
            if (peeringTask.Settings.SubmissionEndDateTime > peeringTask.Settings.ReviewStartDateTime)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                    "Submission end time can't be greater than review start time");
            if (peeringTask.Settings.ReviewStartDateTime > peeringTask.Settings.ReviewEndDateTime)
                return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                    "Review start time can't be greater than review end time");
            
            var newTask = new PeeringTask
            {
                ID = Guid.NewGuid(),
                Title = peeringTask.MainInfo.Title,
                Description = peeringTask.MainInfo.Description,
                Course = course,
                SubmissionStartDateTime = peeringTask.Settings.SubmissionStartDateTime.Value,
                SubmissionEndDateTime = peeringTask.Settings.SubmissionEndDateTime.Value,
                ReviewStartDateTime = peeringTask.Settings.ReviewStartDateTime.Value,
                ReviewEndDateTime = peeringTask.Settings.ReviewEndDateTime.Value,
                SubmissionsToCheck = peeringTask.Settings.SubmissionsToCheck,
                ReviewType = peeringTask.Settings.ReviewType
            };
            
            var initialTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Course == course && t.TaskType == TaskTypes.Initial);
            if (initialTask != null)
            {
                if (initialTask.ReviewEndDateTime > DateTime.Now)
                    return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>(
                        "The initial task hasn't ended yet");
                
                var courseStudentConnections = await _context.CourseUsers
                    .Where(cu => cu.Course == course)
                    .ToListAsync();

                var noConfidenceFactorStudents = courseStudentConnections
                    .Where(csc => csc.ConfidenceFactor == null)
                    .ToList();

                if (courseStudentConnections.Count == noConfidenceFactorStudents.Count)
                    return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>(
                        "Initial task has ended but no students have confidence factor");
                
                foreach (var courseStudent in noConfidenceFactorStudents)
                {
                    courseStudent.ConfidenceFactor = 0;
                }

                newTask.TaskType = TaskTypes.Common;
            }
            else
            {
                if (peeringTask.Settings.Experts == null)
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                        "The task is initial but no experts provided");
                newTask.TaskType = TaskTypes.Initial;
                newTask.ExpertsAssigned = false;
                foreach (var email in peeringTask.Settings.Experts)
                {
                    var expertUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                    
                    var courseUser = await _context.CourseUsers.FirstOrDefaultAsync(cu =>
                            cu.Course == course && cu.User == expertUser);
                    if (courseUser != null)
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                            $"Expert {expertUser.Email} is a student of this course");
                    
                    var expert = new Expert()
                    {
                        ID = Guid.NewGuid(),
                        Email = email,
                        User = expertUser,
                        PeeringTask = newTask
                    };

                    await _context.Experts.AddAsync(expert);
                }
            }

            await _context.Tasks.AddAsync(newTask);
            //TODO: Feature should be changed later

            var students = await _context.CourseUsers
                .Where(cu => cu.Course == course)
                .Select(cu => cu.User)
                .ToListAsync();

            foreach (var student in students)
            {
                var courseUser = await _context.CourseUsers
                    .FirstOrDefaultAsync(cu => cu.User == student && cu.Course == course);
                var taskUser = new PeeringTaskUser()
                {
                    ID = Guid.NewGuid(),
                    PeeringTask = newTask,
                    Student = student,
                    State = PeeringTaskStates.Assigned,
                    PreviousConfidenceFactor = courseUser.ConfidenceFactor ?? 0
                };
                await _context.TaskUsers.AddAsync(taskUser);
            }

            foreach(var authorQuestion in peeringTask.AuthorForm.Rubrics)
            {
                var newAuthorQuestion = _mapper.Map<Question>(authorQuestion);
                newAuthorQuestion.ID = Guid.NewGuid();
                newAuthorQuestion.PeeringTask = newTask;
                newAuthorQuestion.RespondentType = RespondentTypes.Author;
                if (newAuthorQuestion.Type == QuestionTypes.Multiple)
                {
                    if(authorQuestion.Responses == null || authorQuestion.Responses.Count < 2)
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                            "Not enough variants provided in multiple-type question");
                    var variantIds = new List<int>();
                    foreach (var newVariant in authorQuestion.Responses.Select(variant => new Variant()
                    {
                        ID = Guid.NewGuid(),
                        Response = variant.Response,
                        Question = newAuthorQuestion,
                        ChoiceId = variant.Id
                    }))
                    {
                        if (variantIds.Contains(newVariant.ChoiceId))
                            return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                                "Incorrect choice id provided");
                        variantIds.Add(newVariant.ChoiceId);
                        await _context.Variants.AddAsync(newVariant);
                    }

                    /*
                    if (!variantIds.Contains(0))
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Missed variant with id 0");
                    foreach (var variantId in variantIds.Where(variantId => variantId!=0 && !variantIds.Contains(variantId-1)))
                    {
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Missed variant with id " +
                            (variantId - 1));
                    }*/
                }
                await _context.Questions.AddAsync(newAuthorQuestion);
            }

            foreach(var peerQuestion in peeringTask.PeerForm.Rubrics)
            {
                var newPeerQuestion = _mapper.Map<Question>(peerQuestion);
                newPeerQuestion.ID = Guid.NewGuid();
                newPeerQuestion.PeeringTask = newTask;
                newPeerQuestion.RespondentType = RespondentTypes.Peer;
                if (!newPeerQuestion.Required)
                    newPeerQuestion.CoefficientPercentage = null;
                else
                {
                    if (newPeerQuestion.Type == QuestionTypes.Select && peerQuestion.CoefficientPercentage == null)
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                            "Coefficient Percentage can't be null in a required select question");
                }
                if (newPeerQuestion.Type == QuestionTypes.Multiple)
                {
                    if(peerQuestion.Responses == null || peerQuestion.Responses.Count < 2)
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                            "Not enough variants provided in multiple-type question");
                    var variantIds = new List<int>();
                    foreach (var newVariant in peerQuestion.Responses.Select(variant => new Variant()
                    {
                        ID = Guid.NewGuid(),
                        Response = variant.Response,
                        Question = newPeerQuestion,
                        ChoiceId = variant.Id
                    }))
                    {
                        if (variantIds.Contains(newVariant.ChoiceId))
                            return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                                "Incorrect choice id provided");
                        variantIds.Add(newVariant.ChoiceId);
                        await _context.Variants.AddAsync(newVariant);
                    }
                    /*
                    if (!variantIds.Contains(0))
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Missed variant with id 0");
                    foreach (var variantId in variantIds.Where(variantId => variantId!=0 && !variantIds.Contains(variantId-1)))
                    {
                        return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>("Missed variant with id " +
                            (variantId - 1));
                    }*/
                }
                await _context.Questions.AddAsync(newPeerQuestion);
            }
            
            await _context.SaveChangesAsync();

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
            return new SuccessfulResponse<GetNewPeeringTaskDtoResponse>(_mapper.Map<GetNewPeeringTaskDtoResponse>(newTask));
        }
    
        public async Task<Response<string>> AssignPeers(AssignPeersDto peersInfo)
        {
            var startTime = DateTime.Now;
            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == peersInfo.TaskId);
            if (task.PeersAssigned)
                return new SuccessfulResponse<string>("Peers have been already assigned");
            task.PeersAssigned = true;
            await _context.SaveChangesAsync();
            var submissions = await _context.Submissions
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

            await _context.SubmissionPeers.AddRangeAsync(submissionPeers);
            await _context.SaveChangesAsync();
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
            var task = await _context.Tasks
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
            await _context.SaveChangesAsync();
            var experts = await _context.Experts
                .Include(e => e.User)
                .Where(e => e.PeeringTask == task)
                .ToListAsync();
            

            var unregisteredExperts = experts.Where(e => e.User == null).ToList();
            _context.Experts.RemoveRange(unregisteredExperts);
            await _context.SaveChangesAsync();
            var registeredExperts = experts.Where(e => e.User != null).ToList();
           
            if (registeredExperts.Count == 0)
                return new SuccessfulResponse<string>("No experts registered for this task");
            
            var submissions = await _context.Submissions
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

            await _context.SubmissionPeers.AddRangeAsync(submissionPeers);
            await _context.SaveChangesAsync();
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

            var deadlines = await GetTaskDeadlines(task);

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

            response.Deadlines = await GetTaskDeadlines(task);
            response.TaskType = task.TaskType;

            return new SuccessfulResponse<GetPeeringTaskOverviewDtoResponse>(response);
        }
        private async Task<GetPeeringTaskDeadlinesDtoResponse> GetTaskDeadlines(PeeringTask task)
        {
            return _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);
        }
        private async Task<GetPeeringTaskOverviewDtoResponse> GetExpertTaskOverview(User expert, PeeringTask task)
        {
            throw new NotImplementedException();
        }
        private async Task<GetPeeringTaskOverviewDtoResponse> GetTeacherTaskOverview(PeeringTask task)
        {
            var taskStudents = await GetTaskUserAssignments(task);

            return new GetPeeringTaskOverviewDtoResponse()
            {
                //Statistics = ?????
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
        private async Task<List<PeeringTaskUser>> GetTaskUserAssignments(PeeringTask task)
        {
            return await _context.TaskUsers
                .Where(tu => tu.PeeringTask == task)
                .ToListAsync();
        }
        private List<int> GetFinalGrades(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.FinalGrade).ToList();
        }

        private List<float> GetPreviousConfidenceFactors(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.PreviousConfidenceFactor).ToList();
        }

        private List<float?> GetNextConfidenceFactors(IEnumerable<PeeringTaskUser> taskUsers)
        {
            return taskUsers.Select(tu => tu.NextConfidenceFactor).ToList();
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
                Status = new GetPeeringTaskStatusDtoResponse()
                {
                    SubmissionsNumber = assignedSubmissions.Count,
                    SubmissionsToCheck = assignedSubmissions.Count - reviewedSubmissions.Count
                },
                SubmissionStatus = submission != null,
                StudentGrades = submission == null
                    ? null
                    : new GetPeeringTaskStudentGradesDtoResponse()
                    {
                        MinGrade = MinPossibleGrade,
                        MaxGrade = MaxPossibleGrade,
                        Coordinates = await GetReviewsCoordinates(await GetReviewsForSubmission(submission))
                    },
                StudentConfidenceFactors = confidenceFactors
            };
        }
        private async Task<List<SubmissionPeer>> GetAssignedSubmissions(User peer, PeeringTask task)
        {
            return  await _context.SubmissionPeers
                .Where(sp => sp.Peer == peer && sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
        }
        private async Task<List<Review>> GetReviewedSubmissions(IEnumerable<SubmissionPeer> assignedSubmissions)
        {
            return await _context.Reviews
                .Where(r => assignedSubmissions.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();
        }

        private async Task<List<Review>> GetReviewsForSubmission(Submission submission)
        {
            return await _context.Reviews
                .Where(r => r.SubmissionPeerAssignment.Submission == submission)
                .Include(r => r.SubmissionPeerAssignment.Peer)
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

                var expert = await _context.Experts
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
        /*
        public async Task<Response<GetPeeringTaskStudentOverviewDtoResponse>> GetTaskStudentOverview(GetPeeringTaskStudentOverviewRequest taskInfo)
        {
            var submissionPeers =
            var checkedWorksCount = await _context.Reviews
                .CountAsync(r => submissionPeers.Contains(r.SubmissionPeerAssignment));
            var assignedWorksCount = submissionPeers.Count;
            
            var expertUser = await _context.Experts.FirstOrDefaultAsync(x => x.User == student && x.PeeringTask == task);
            if (expertUser != null)
                return new SuccessfulResponse<GetPeeringTaskStudentOverviewDtoResponse>
                (new GetPeeringTaskStudentOverviewDtoResponse
                {
                    Deadlines = deadlines,
                    CheckedWorksCount = task.ReviewStartDateTime < DateTime.Now ? checkedWorksCount : null,
                    AssignedWorksCount = task.ReviewStartDateTime < DateTime.Now ? assignedWorksCount : null
                });

            var taskUserConnection = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUserConnection == null)
                return new NoAccessResponse<GetPeeringTaskStudentOverviewDtoResponse>("This student has no access to this task");

            var status = new GetPeeringTaskStatusDtoResponse
            {
                SubmissionsToCheck = task.SubmissionsToCheck,
                SubmissionsNumber = checkedWorksCount
            };

            var submissionStatus = await _context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUserConnection) != null;

            var questions = await _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Peer && q.Type == QuestionTypes.Select && q.Required)
                .ToListAsync();

            float minGrade = 0;
            float maxGrade = 0;
            foreach (var question in questions)
            {
                if (question.MinValue == null || question.MaxValue == null || question.CoefficientPercentage == null)
                    return new OperationErrorResponse<GetPeeringTaskStudentOverviewDtoResponse>(
                        "There is an error in database");
                
                minGrade += question.MinValue.Value * question.CoefficientPercentage.Value / 100;
                maxGrade += question.MaxValue.Value * question.CoefficientPercentage.Value / 100;
            }

            var reviews = await _context.Reviews
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUserConnection)
                .ToListAsync();

            var coordinates = new List<GetPeeringTaskCoordinatesDtoResponse>();
            var index = 0;
            foreach (var review in reviews)
            {
                var peer = review.SubmissionPeerAssignment.Peer;

                var expert = await _context.Experts
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
                    default:
                        return new OperationErrorResponse<GetPeeringTaskStudentOverviewDtoResponse>(
                            "There is an error in database");
                }

                resultReview.Value = review.Grade;

                coordinates.Add(resultReview);
            }

            var studentGrades = new GetPeeringTaskStudentGradesDtoResponse
            {
                MinGrade = minGrade,
                MaxGrade = maxGrade,
                Coordinates = coordinates
            };

            var studentConfidenceCoefficients = new GetPeeringTaskCoefficientsDtoResponse
            {
                Before =  task.TaskType == TaskTypes.Initial ? taskUserConnection.PreviousConfidenceFactor : null,
                After = task.ReviewEndDateTime < DateTime.Now ? taskUserConnection.NextConfidenceFactor : null
            }; 

            return new SuccessfulResponse<GetPeeringTaskStudentOverviewDtoResponse>
            (new GetPeeringTaskStudentOverviewDtoResponse
            {
                Deadlines = deadlines,
                Status = status,
                SubmissionStatus = submissionStatus,
                StudentGrades = studentGrades,
                TaskType = task.TaskType,
                StudentConfidenceCoefficients = studentConfidenceCoefficients
            });
        }
*/
        public async Task<Response<GetCourseTasksDtoResponse>> GetTeacherCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            
            var teacher = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid teacher id");
           
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var expert = await _context.Experts.FirstOrDefaultAsync(x => x.User == teacher && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            if(course.Teacher != teacher)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This teacher has no access to the course");

            var tasks = await _context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
                .ToListAsync();
        
            return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
            {
                Tasks = tasks
            });

        }
        
        public async Task<Response<GetCourseTasksDtoResponse>> GetStudentCourseTasks(GetCourseTasksDtoRequest courseInfo)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.ID == courseInfo.CourseId);
            if (course == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid course id");

            var student = await _context.Users.FirstOrDefaultAsync(x => x.ID == courseInfo.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<GetCourseTasksDtoResponse>("Invalid user id");

            var expert = await _context.Experts.FirstOrDefaultAsync(x => x.User == student && x.PeeringTask.Course == course);
            if (expert != null)
                return new SuccessfulResponse<GetCourseTasksDtoResponse>(new GetCourseTasksDtoResponse
                {
                    Tasks = await GetExpertCourseTasks(expert, course)
                });
            
            var courseUserConnection = await _context.CourseUsers
                .FirstOrDefaultAsync(x => x.User == student && x.Course == course);
        
            if (courseUserConnection == null)
                return new NoAccessResponse<GetCourseTasksDtoResponse>("This user is not assigned to this course");
            
            var tasks = await _context.Tasks
                .Where(t => t.Course.ID == courseInfo.CourseId)
                .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x))
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
                tasks.AddRange(await _context.Experts
                    .Where(x => x == expert && x.PeeringTask.Course == course)
                    .Select(x => _mapper.Map<GetPeeringTaskMainInfoDtoResponse>(x.PeeringTask))
                    .ToListAsync());
            return tasks;
        }

        /*public async Task<Response<GetPeeringTaskTeacherOverviewDtoResponse>> GetTaskTeacherOverview(GetPeeringTaskTeacherOverviewDtoRequest taskInfo)
        {

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.TeacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid teacher id");

            var task = await _context.Tasks
                .Include(x => x.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid task id");

            var deadlines = _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);

            var submissionPeers = await _context.SubmissionPeers
                .Where(sp => sp.Peer == teacher && sp.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();
            var checkedWorksCount = _context.Reviews
                .Count(r => submissionPeers.Contains(r.SubmissionPeerAssignment));
            var assignedWorksCount = submissionPeers.Count;
            
            var expertUser = await _context.Experts.FirstOrDefaultAsync(x => x.User == teacher && x.PeeringTask == task);
            if (expertUser != null)
                return new SuccessfulResponse<GetPeeringTaskTeacherOverviewDtoResponse>
                (new GetPeeringTaskTeacherOverviewDtoResponse
                {
                    Deadlines = deadlines,
                    CheckedWorksCount = task.ReviewStartDateTime < DateTime.Now ? checkedWorksCount : null,
                    AssignedWorksCount = task.ReviewStartDateTime < DateTime.Now ? assignedWorksCount : null
                });
                
            if (task.Course.Teacher != teacher)
                return new NoAccessResponse<GetPeeringTaskTeacherOverviewDtoResponse>("This teacher has no access to this task");
            
            var totalAssignments = await _context.TaskUsers.CountAsync(tu => tu.PeeringTask == task);
            var submissionsNumber = await _context.Submissions
                .CountAsync(s => s.PeeringTaskUserAssignment.PeeringTask == task);
            var reviewsNumber = await _context.Reviews
                .CountAsync(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task);

            var statistics = new GetPeeringTaskStatisticsDtoResponse
            {
                Submissions = submissionsNumber,
                Review = reviewsNumber,
                Total = totalAssignments
            };

            var grades = await _context.TaskUsers
                .Where(g => g.PeeringTask == task)
                .Select(g => g.FinalGrade)
                .ToListAsync();

            var currentConfidenceCoefficients = await _context.TaskUsers
                .Where(c => c.PeeringTask == task)
                .Select(c => c.PreviousConfidenceFactor)
                .ToListAsync();

            var confidenceCoefficients = await _context.TaskUsers
                .Where(c => c.PeeringTask == task)
                .Select(c => c.NextConfidenceFactor)
                .ToListAsync();

            return new SuccessfulResponse<GetPeeringTaskTeacherOverviewDtoResponse>
                (new GetPeeringTaskTeacherOverviewDtoResponse
                {
                    Statistics = statistics,
                    Deadlines = deadlines,
                    Grades = task.ReviewEndDateTime < DateTime.Now ? grades : null,
                    CurrentConfidenceFactors = task.TaskType == TaskTypes.Common ? currentConfidenceCoefficients : null,
                    ConfidenceFactors = task.ReviewEndDateTime < DateTime.Now ? confidenceCoefficients : null,
                    ReviewType = task.ReviewType,
                    TaskType = task.TaskType
                });
        }
        */
        public async Task<Response<GetAuthorFormDtoResponse>> GetAuthorForm(GetAuthorFormDtoRequest taskInfo)
        {
            var task = await _context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid task id");
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetAuthorFormDtoResponse>("Invalid user id");

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser =
                        await _context.TaskUsers.FirstOrDefaultAsync(tu => tu.Student == user && tu.PeeringTask == task);
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

            var questions = _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Author)
                .OrderBy(q => q.Order);

            var resultQuestions = new List<GetAuthorQuestionDtoResponse>();
            foreach (var question in questions)
            {
                var resultQuestion = _mapper.Map<GetAuthorQuestionDtoResponse>(question);
                resultQuestion.QuestionId = question.ID;
                if (question.Type == QuestionTypes.Multiple)
                {
                    var variants = await _context.Variants
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
            var task = await _context.Tasks
                .Include(t=>t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeerFormDtoResponse>("Invalid task id provided");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetPeerFormDtoResponse>("Invalid user id provided");
            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            
            switch (user.Role)
            {
                case {} when expert!= null:
                    break;
                case UserRoles.Teacher when task.Course.Teacher != user:
                    return new NoAccessResponse<GetPeerFormDtoResponse>("This teacher has no access to this course");
                case UserRoles.Student:
                    var taskUser = await _context.TaskUsers
                        .FirstOrDefaultAsync(tu => tu.PeeringTask == task && tu.Student == user);
                    if (taskUser == null)
                        return new NoAccessResponse<GetPeerFormDtoResponse>("This task is not assigned to this user");
                    if (task.ReviewEndDateTime < DateTime.Now)
                        return new OperationErrorResponse<GetPeerFormDtoResponse>("The deadline has already passed");
                    if (task.ReviewStartDateTime > DateTime.Now)
                        return new OperationErrorResponse<GetPeerFormDtoResponse>("Reviewing hasn't started yet");
                    break;
            }
            
            var questions = _context.Questions
                .Where(q => q.PeeringTask == task && q.RespondentType == RespondentTypes.Peer)
                .OrderBy(q => q.Order);
            
            var resultQuestions = new List<GetPeerQuestionDtoResponse>();
            foreach (var question in questions)
            {
                var resultQuestion = _mapper.Map<GetPeerQuestionDtoResponse>(question);
                resultQuestion.QuestionId = question.ID;
                if (question.Type == QuestionTypes.Multiple)
                {
                    var variants = await _context.Variants
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid user id provided");

            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid task id provided");

            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
                return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                {
                    State = GetTaskSubmissionDeadlineState(task)
                });

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser = await _context.TaskUsers
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid user id provided");

            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetTaskDeadlineDtoResponse>("Invalid task id provided");

            var expert = await _context.Experts.FirstOrDefaultAsync(e => e.User == user && e.PeeringTask == task);
            if (expert != null)
                return new SuccessfulResponse<GetTaskDeadlineDtoResponse>(new GetTaskDeadlineDtoResponse()
                {
                    State = GetTaskReviewDeadlineState(task)
                });

            switch (user.Role)
            {
                case UserRoles.Student:
                {
                    var taskUser = await _context.TaskUsers
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
            var task = await _context.Tasks
                .Include(t => t.Course)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<string>("Invalid task id provided");

            var taskUsers = await _context.TaskUsers
                .Include(tu => tu.Student)
                .Include(tu => tu.PeeringTask)
                .Include(tu => tu.PeeringTask.Course)
                .Where(tu => tu.PeeringTask == task)
                .ToListAsync();
            foreach (var taskUser in taskUsers)
            {
                var student = taskUser.Student;
                Console.WriteLine($"Student Name: {student.Fullname}");
                
                var courseUser = await _context.CourseUsers
                    .FirstOrDefaultAsync(cu => cu.User == student && cu.Course == task.Course);

                if (task.TaskType == TaskTypes.Initial)
                {
                    var expertReview = await GetExpertReview(taskUser);
                    var teacherReview = await GetTeacherReview(taskUser);
                    var grade = teacherReview?.Grade ?? expertReview.Grade;
                    grade *= await GetReviewedPercentage(taskUser);
                    var confidenceFactor = await CountInitialConfidenceFactor(taskUser, grade);
                    if (confidenceFactor == null)
                        return new OperationErrorResponse<string>("There is an error in counting initial confidence factors");
                    courseUser.ConfidenceFactor = confidenceFactor.Value;
                    taskUser.NextConfidenceFactor = confidenceFactor.Value;
                    taskUser.FinalGrade = (int)Math.Round(grade);
                }
                else
                {
                    var confidenceFactor = await CountNewConfidenceFactor(taskUser) ?? taskUser.PreviousConfidenceFactor;
                    courseUser.ConfidenceFactor = confidenceFactor;
                    taskUser.NextConfidenceFactor = confidenceFactor;
                    Console.WriteLine($"Confidence factor before task: {taskUser.PreviousConfidenceFactor}");
                    Console.WriteLine($"Confidence factor after task: {taskUser.NextConfidenceFactor}");
                }

            }

            await _context.SaveChangesAsync();
            return new SuccessfulResponse<string>("Factors recalculated successfully. All grades are set");
        }

        public async Task<Response<GetPerformanceTableDtoResponse>> GetPerformanceTable(GetPerformanceTableDtoRequest taskInfo)
        {
            var teacher = await _context.Users
                .FirstOrDefaultAsync(u => u.ID == taskInfo.TeacherId && u.Role == UserRoles.Teacher);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid teacher id provided");

            var task = await _context.Tasks
                .Include(t => t.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPerformanceTableDtoResponse>("Invalid task id provided");

            if (teacher != task.Course.Teacher)
                return new NoAccessResponse<GetPerformanceTableDtoResponse>(
                    "This teacher isn't the teacher of this course");
            
            var taskStudents = await _context.TaskUsers
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

            var submission = await _context.Submissions
                .FirstOrDefaultAsync(s => s.PeeringTaskUserAssignment == taskUser);
            studentInfo.Submitted = submission != null;
            if (!studentInfo.Submitted)
                return studentInfo;

            

            
            var submissionPeers = await _context.SubmissionPeers
                .Where(sp => sp.Submission == submission && sp.Peer != teacher)
                .ToListAsync();

            var reviews = await _context.Reviews
                .Where(r => submissionPeers.Contains(r.SubmissionPeerAssignment))
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .ToListAsync();

            var teacherReview = await _context.Reviews.FirstOrDefaultAsync(r => 
                r.SubmissionPeerAssignment.Peer == teacher
                && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser);
            studentInfo.TeacherReviewed = teacherReview != null;

            if (taskUser.PeeringTask.SubmissionEndDateTime < DateTime.Now)
            {
                var submissionsAssignedToStudent = await _context.SubmissionPeers
                    .Where(sp =>
                        sp.Peer == taskUser.Student &&
                        sp.Submission.PeeringTaskUserAssignment.PeeringTask == taskUser.PeeringTask)
                    .ToListAsync();

                studentInfo.AssignedSubmissions = submissionsAssignedToStudent.Count;
                studentInfo.ReviewedSubmissions = await _context.Reviews
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

        private async Task<ReviewQualities?> GetReviewQuality(Course course, IEnumerable<Review> reviews)
        {
            var confidenceFactorsSum = 0f;
            var reviewersAmount = 0;
            foreach (var review in reviews)
            {
                var courseUser = await _context.CourseUsers.FirstOrDefaultAsync(cu =>
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
                < BadAverageConfidenceFactor => ReviewQualities.Bad,
                < DecentAverageConfidenceFactor => ReviewQualities.Decent,
                _ => ReviewQualities.Good
            };
        }

        private async Task<Review> GetExpertReview(PeeringTaskUser taskUser)
        {
            var student = taskUser.Student;
            var task = taskUser.PeeringTask;
            
            var peers = await _context.Reviews
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .Select(r => r.SubmissionPeerAssignment.Peer)
                .ToListAsync();
                
            var expert = await _context.Experts
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.PeeringTask == task && peers.Contains(e.User));
                
            var expertReview = await _context.Reviews
                .FirstOrDefaultAsync(r => 
                    r.SubmissionPeerAssignment.Peer == expert.User
                    && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task
                    && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student == student);

            return expertReview;
        }

        private async Task<Review> GetTeacherReview(PeeringTaskUser taskUser)
        {
            return await _context.Reviews.FirstOrDefaultAsync(r => 
                    r.SubmissionPeerAssignment.Peer == taskUser.PeeringTask.Course.Teacher
                    && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser);
        }
        private async Task<float?> CountInitialConfidenceFactor(PeeringTaskUser taskUser, float grade)
        {
            var task = taskUser.PeeringTask;
            var student = taskUser.Student;
            
            var expertUsers = await _context.Experts
                    .Where(e => e.PeeringTask == task)
                    .Select(e => e.User)
                    .ToListAsync();
            
            var peerReviews = await _context.Reviews
                .Include(r => r.SubmissionPeerAssignment)
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment)
                .Where(r => r.SubmissionPeerAssignment.Peer == student 
                            && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();

            var expertReviews = await _context.Reviews
                .Include(r => r.SubmissionPeerAssignment)
                .Include(r => r.SubmissionPeerAssignment.Submission)
                .Include(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment)
                .Where(r => expertUsers.Contains(r.SubmissionPeerAssignment.Peer)
                            && r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.PeeringTask == task)
                .ToListAsync();


            var normalizedErrors = new List<float>();
            
            foreach (var peerReview in peerReviews)
            {
                
                var expertReview = expertReviews.Find(er =>
                    er.SubmissionPeerAssignment.Submission == peerReview.SubmissionPeerAssignment.Submission);

                var teacherReview = await _context.Reviews
                    .FirstOrDefaultAsync(r => r.SubmissionPeerAssignment.Peer == taskUser.PeeringTask.Course.Teacher);

                if (teacherReview == null && expertReview == null)
                {
                    Console.WriteLine("Neither experts nor teacher reviewed this submission");
                    return null;
                }
                
                var peerAnswers = await _context.Answers
                    .Where(a => a.Review == peerReview && a.Question.Type == QuestionTypes.Select)
                    .OrderBy(a => a.Question)
                    .Include(a => a.Question)
                    .ToListAsync();

                var expertAnswers = await _context.Answers
                    .Where(a => a.Review == expertReview &&
                                a.Question.Type == QuestionTypes.Select)
                    .OrderBy(a => a.Question)
                    .Include(a => a.Question)
                    .ToListAsync();

                var teacherAnswers = new List<Answer>();
                if (teacherReview != null)
                    teacherAnswers = await _context.Answers
                        .Where(a => a.Review == teacherReview &&
                                    a.Question.Type == QuestionTypes.Select)
                        .OrderBy(a => a.Question)
                        .Include(a => a.Question)
                        .ToListAsync();
                var error = 0f;
                var maxError = 0f;
                for (var i = 0; i < peerAnswers.Count; i++)
                {
                    var question = peerAnswers[i].Question;
                    
                    if (peerAnswers[i].Value == null || expertAnswers[i].Value == null)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if(teacherReview != null && teacherAnswers[i].Value == null)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if (peerAnswers[i].Question != expertAnswers[i].Question)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if(teacherReview != null && peerAnswers[i].Question != teacherAnswers[i].Question)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if (question.CoefficientPercentage == null)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if (question.MinValue == null)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    if (question.MaxValue == null)
                    {
                        Console.WriteLine("There is an error in database");
                        return null;
                    }
                    
                    var normalizingFactor = (question.CoefficientPercentage.Value / 100);
                    var answerValuesDifference = teacherReview != null 
                        ? Math.Abs(peerAnswers[i].Value.Value - teacherAnswers[i].Value.Value) 
                        : Math.Abs(peerAnswers[i].Value.Value - expertAnswers[i].Value.Value);
                    Console.WriteLine($"Answers difference: {answerValuesDifference}");
                    Console.WriteLine($"Normalizing factor: {normalizingFactor}");
                    error += answerValuesDifference * normalizingFactor;
                    maxError += (question.MaxValue.Value - question.MinValue.Value) * normalizingFactor;
                }
                Console.WriteLine($"Error: {error}");
                Console.WriteLine($"Max Error: {maxError}");
                
                normalizedErrors.Add(error/maxError);
                Console.WriteLine($"Normalized error: {normalizedErrors[^1]}");
            }
            
            var resultError = normalizedErrors.Sum() / normalizedErrors.Count;
            Console.WriteLine($"Result error: {resultError}");
            var resultConfidenceFactor = ((1 - resultError)*MaxPossibleGrade + grade)/(2*MaxPossibleGrade);
            resultConfidenceFactor *= await GetReviewedPercentage(taskUser);
            Console.WriteLine($"Result confidence factor: {resultConfidenceFactor}");
            return resultConfidenceFactor;
        }

        private async Task<float?> CountNewConfidenceFactor(PeeringTaskUser taskUser)
        {
            var reviews = await _context.Reviews
                .Include(r => r.SubmissionPeerAssignment.Peer)
                .Where(r => r.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment == taskUser)
                .ToListAsync();
            
            if (reviews.Count == 0)
                return null;

            var confidenceFactorsSum = 0f;
            var resultGrade = 0f;
            foreach (var review in reviews)
            {
                var peerConfidenceFactor = await _context.CourseUsers
                    .Where(cu => 
                        cu.Course == taskUser.PeeringTask.Course && cu.User == review.SubmissionPeerAssignment.Peer)
                    .Select(cu => cu.ConfidenceFactor)
                    .FirstOrDefaultAsync();
                if (peerConfidenceFactor == null)
                    return null;
                resultGrade += review.Grade * peerConfidenceFactor.Value;
                confidenceFactorsSum += peerConfidenceFactor.Value;
            }
            resultGrade /= confidenceFactorsSum;
            resultGrade *= await GetReviewedPercentage(taskUser);
            Console.WriteLine($"Mid-calculated grade: {resultGrade}");
            var newConfidenceFactor = taskUser.PreviousConfidenceFactor * MaxPossibleGrade;
            newConfidenceFactor += resultGrade;
            newConfidenceFactor /= (2*MaxPossibleGrade);
            taskUser.FinalGrade = (int) Math.Round(resultGrade);
            Console.WriteLine($"Final grade: {taskUser.FinalGrade}");
            return newConfidenceFactor;
        }

        private async Task<float> GetReviewedPercentage(PeeringTaskUser taskUser)
        {
            var assignedSubmissions = await _context.SubmissionPeers
                .Where(sp => sp.Peer == taskUser.Student
                             && sp.Submission.PeeringTaskUserAssignment.PeeringTask == taskUser.PeeringTask)
                .ToListAsync();

            var reviewedSubmissions = await _context.Reviews
                .Where(r => assignedSubmissions.Contains(r.SubmissionPeerAssignment))
                .ToListAsync();

            return reviewedSubmissions.Count * 1f / assignedSubmissions.Count;
        }
    }
}