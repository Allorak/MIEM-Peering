using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Submission;
using patools.Errors;
using patools.Models;

namespace patools.Services.Submissions
{
    public class SubmissionsService : ISubmissionsService
    {
        private readonly PAToolsContext _context;
        private readonly IMapper _mapper;

        public SubmissionsService(PAToolsContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        
        public async Task<Response<string>> AddSubmission(AddSubmissionDto submission)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.ID == submission.UserId);
            if (student == null)
                return new InvalidGuidIdResponse<string>("Invalid user id");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == submission.TaskId);
            if (task == null)
                return new InvalidGuidIdResponse<string>("Invalid task id");
            
            var taskUser = await _context.TaskUsers
                .FirstOrDefaultAsync(tu => tu.Student == student && tu.Task == task);
            if (taskUser == null)
                return new InvalidGuidIdResponse<string>("The task isn't assigned to this user");

            var newSubmission = new Submission()
            {
                ID = Guid.NewGuid(),
                TaskUserAssignment = taskUser
            };
            taskUser.State = TaskState.Checking;
            await _context.Submissions.AddAsync(newSubmission);

            var newAnswers = new List<Answer>();
            foreach (var answer in submission.Answers)
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.Task == taskUser.Task && q.Order == answer.Order);
                
                if (question == null)
                    return new BadRequestDataResponse<string>($"Incorrect Order({answer.Order}) in answer");
                
                newAnswers.Add(new Answer
                {
                    ID = Guid.NewGuid(),
                    Submission = newSubmission,
                    Question = question,
                    Text = answer.Text
                });
            }
            await _context.Answers.AddRangeAsync(newAnswers);
            await _context.SaveChangesAsync();

            return new SuccessfulResponse<string>("Submission added successfully");
        }
    }
}