using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace patools.Models
{
    public class PAToolsContext : DbContext
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<PeeringTask> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Variant> Variants { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Expert> Experts { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public DbSet<CourseUser> CourseUsers { get; set; }
        public DbSet<GroupUser> GroupUsers { get; set; }
        public DbSet<PeeringTaskUser> TaskUsers { get; set; }
        public DbSet<SubmissionPeer> SubmissionPeers { get; set; }
        public DbSet<AnswerFile> AnswerFiles { get; set; }

        public PAToolsContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseNpgsql(Startup.ConnectionString);
    }
}