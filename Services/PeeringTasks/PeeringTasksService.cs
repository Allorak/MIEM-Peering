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
using patools.Dtos.Variants;
using patools.Enums;
using patools.Models;
using patools.Errors;
namespace patools.Services.PeeringTasks
{
    public class PeeringTasksService : IPeeringTasksService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public PeeringTasksService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Response<GetPeeringTaskStudentOverviewDtoResponse>> GetTaskStudentOverview(GetPeeringTaskStudentOverviewRequest taskInfo)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.StudentId);
            if (student == null)
                return new InvalidGuidIdResponse<GetPeeringTaskStudentOverviewDtoResponse>("Invalid student id");

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskStudentOverviewDtoResponse>("Invalid task id");

            var taskUserConnection = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.PeeringTask == task);
            if (taskUserConnection == null)
                return new NoAccessResponse<GetPeeringTaskStudentOverviewDtoResponse>("This student has no access to this task");
            
            var deadlines = _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);
            
            var reviewed = 0;
            
            return new SuccessfulResponse<GetPeeringTaskStudentOverviewDtoResponse>
            (new GetPeeringTaskStudentOverviewDtoResponse
            {
                Deadlines = deadlines,
                SubmissionsToCheck = task.SubmissionsToCheck,
                Reviewed = reviewed
            });
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
                Type = peeringTask.Settings.Type
            };
            
            var firstStepTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Course == course && t.Step == PeeringSteps.FirstStep);
            if (firstStepTask != null)
            {
                if (firstStepTask.ReviewEndDateTime > DateTime.Now)
                    return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>(
                        "The first-step task hasn't ended yet");
                
                var courseStudentConnections = await _context.CourseUsers
                    .Where(cu => cu.Course == course)
                    .ToListAsync();

                var noConfidenceFactorStudents = courseStudentConnections
                    .Where(csc => csc.ConfidenceFactor == null)
                    .ToList();

                if (courseStudentConnections.Count == noConfidenceFactorStudents.Count)
                    return new OperationErrorResponse<GetNewPeeringTaskDtoResponse>(
                        "First-step task has ended but no students have confidence factor");
                
                foreach (var courseStudent in noConfidenceFactorStudents)
                {
                    courseStudent.ConfidenceFactor = 0;
                }

                newTask.Step = PeeringSteps.SecondStep;
            }
            else
            {
                if (peeringTask.Settings.Experts == null)
                    return new BadRequestDataResponse<GetNewPeeringTaskDtoResponse>(
                        "The task is first-step but no experts provided");
                newTask.Step = PeeringSteps.FirstStep;
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

            foreach (var taskUser in students.Select(student => new PeeringTaskUser()
            {
                ID = Guid.NewGuid(),
                PeeringTask = newTask,
                Student = student,
                State = PeeringTaskStates.Assigned
            }))
            {
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

            submissionPeers.AddRange(submissions.Select(submission => 
                new SubmissionPeer() {ID = Guid.NewGuid(), Peer = task.Course.Teacher, Submission = submission}));

            await _context.SubmissionPeers.AddRangeAsync(submissionPeers);
            await _context.SaveChangesAsync();
            var endTime = DateTime.Now;
            return new SuccessfulResponse<string>($"Result: Experts assigned successfully for the task with id {task.ID} " +
                                                  $"| Time: {(endTime-startTime).TotalMilliseconds} ms"+
                                                  $"| Experts: {registeredExperts.Count}"+
                                                  $"| SubmissionsPerExpert: {submissionsPerExpert}"+
                                                  $"| TotalSubmissionPeers: {submissionPeers.Count}");
        }

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

        public async Task<Response<GetPeeringTaskTeacherOverviewDtoResponse>> GetTaskTeacherOverview(GetPeeringTaskTeacherOverviewDtoRequest taskInfo)
        {

            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.ID == taskInfo.TeacherId);
            if (teacher == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid teacher id");

            var task = await _context.Tasks
                .Include(x => x.Course.Teacher)
                .FirstOrDefaultAsync(t => t.ID == taskInfo.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<GetPeeringTaskTeacherOverviewDtoResponse>("Invalid task id");

            if (task.Course.Teacher.ID != teacher.ID)
                return new NoAccessResponse<GetPeeringTaskTeacherOverviewDtoResponse>("This teacher has no access to this task");
            
            var totalAssignments = await _context.TaskUsers.CountAsync(tu => tu.PeeringTask == task);
            int submissionsNumber = 1;
            int reviewsNumber = 1;
            float[] grades = {10,10,10,10,10,10};

            var statistics = new GetPeeringTaskStatisticsDtoResponse
            {
                Submissions = submissionsNumber,
                Review = reviewsNumber,
                Total = totalAssignments
            };
            var deadlines = _mapper.Map<GetPeeringTaskDeadlinesDtoResponse>(task);

            return new SuccessfulResponse<GetPeeringTaskTeacherOverviewDtoResponse>
                (new GetPeeringTaskTeacherOverviewDtoResponse
                {
                    Statistics = statistics,
                    Deadlines = deadlines,
                    Grades = grades
                });
        }
        
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
    }
}