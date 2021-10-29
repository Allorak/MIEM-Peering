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

namespace patools
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            PAToolsContext db = new PAToolsContext();
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
        
        public static void InitializeDB(PAToolsContext db)
        {
            if(db.Users.Any())
                return;

            var users = new List<User>
            {
                new User
                {
                    ID = Guid.NewGuid(),
                    Fullname = "Моисеев Михаил",
                    Status = UserStatuses.Student,
                    Email = "mvmoiseev@miem.hse.ru",
                    Password = "12343123"
                }
            };
            
            db.Users.AddRange(users);
            db.SaveChanges();
        }
    }
}
