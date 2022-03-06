using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using patools.Dtos.Answer;
using patools.Dtos.Submission;
using patools.Enums;
using patools.Errors;
using patools.Models;

namespace patools.Services.Files
{
    public class FilesService : ServiceBase, IFilesService
    {
        public FilesService(PAToolsContext context, IMapper mapper) : base (context, mapper)
        {
        }
        
        public async Task<List<GetAnswerFileInfoDto>> GetFilesByAnswer(Answer answer)
        {
            if (answer.Question.Type != QuestionTypes.File)
                return null;
            
            var files = await Context.AnswerFiles
                .Where(af => af.Answer == answer)
                .Select(af => new GetAnswerFileInfoDto()
                {
                    Id = af.ID,
                    Name = af.FileName
                })
                .OrderBy(af => af.Name)
                .ToListAsync();
            return files.Count > 0 ? files : null;
        }

        public async Task<Response<GetFileByIdDtoResponse>> GetAnswerFileById(GetFileByIdDtoRequest fileInfo)
        {
            var user = await GetUserById(fileInfo.UserId);
            if (user == null)
                return new InvalidGuidIdResponse<GetFileByIdDtoResponse>("Invalid user id provided");

            var answerFile = await GetAnswerFileById(fileInfo.AnswerFileId);
            if (answerFile == null)
                return new InvalidGuidIdResponse<GetFileByIdDtoResponse>("Invalid file id provided");
        
            var task = answerFile.Answer.Question.PeeringTask;
            
            var submission = answerFile.Answer.Submission;
            var review = answerFile.Answer.Review;
            if (submission != null)
            {
                switch (user.Role)
                {
                    case { } when await IsExpertUser(user, task):
                        if (task.ReviewStartDateTime > DateTime.Now)
                            return new NoAccessResponse<GetFileByIdDtoResponse>("Reviewing stage hasn't started yet");
                        break;
                    case UserRoles.Teacher when user != task.Course.Teacher:
                        return new NoAccessResponse<GetFileByIdDtoResponse>("This teacher has no access to this file");
                    case UserRoles.Student
                        when user != submission.PeeringTaskUserAssignment.Student:
                        var submissionPeer = await GetSubmissionPeer(submission, user);
                        if (submissionPeer == null)
                            return new NoAccessResponse<GetFileByIdDtoResponse>(
                                "This student has no access to this file");
                        if (task.ReviewStartDateTime > DateTime.Now)
                            return new NoAccessResponse<GetFileByIdDtoResponse>("Reviewing stage hasn't started yet");
                        break;
                }
            }
            else if (review != null)
            {
                switch (user.Role)
                {
                    case { } when await IsExpertUser(user, task):
                        if (task.ReviewStartDateTime > DateTime.Now)
                            return new NoAccessResponse<GetFileByIdDtoResponse>("Reviewing stage hasn't started yet");
                        break;
                    case UserRoles.Teacher when user != task.Course.Teacher:
                        return new NoAccessResponse<GetFileByIdDtoResponse>("This teacher has no access to this file");
                    case UserRoles.Student
                        when user != review.SubmissionPeerAssignment.Peer && user != review.SubmissionPeerAssignment.Submission.PeeringTaskUserAssignment.Student:
                        return new NoAccessResponse<GetFileByIdDtoResponse>(
                                "This student has no access to this file");
                }
            }
            else
            {
                return new OperationErrorResponse<GetFileByIdDtoResponse>("There is an error in database");
            }

            var fileContents = await File.ReadAllBytesAsync(answerFile.FilePath);
            new FileExtensionContentTypeProvider().TryGetContentType(answerFile.FilePath, out var contentType);
            return new SuccessfulResponse<GetFileByIdDtoResponse>(new GetFileByIdDtoResponse()
            {
                FileContents = fileContents,
                FileName = answerFile.FileName,
                ContentType = contentType ?? "application/octet-stream"
            });
        }
        
     }
}