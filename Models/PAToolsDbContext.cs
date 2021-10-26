using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace patools.Models
{
    public class PAToolsContext : DbContext
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Variant> Variants { get; set; }

        public DbSet<CourseUser> CourseUsers { get; set; }
        public DbSet<GroupUser> GroupUsers { get; set; }
        public DbSet<TaskUser> TaskUsers { get; set; }

        public string DbPath { get; private set; }

        public PAToolsContext()
        {
            //var folder = Environment.SpecialFolder.LocalApplicationData;
            //var path = Environment.GetFolderPath(folder);
            var path = Environment.CurrentDirectory;
            DbPath = $"{path}{System.IO.Path.DirectorySeparatorChar}app.db";
        }

        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Filename={DbPath}");
    }
}