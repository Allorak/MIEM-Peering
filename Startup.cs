using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.PostgreSql;
using Hangfire.SQLite;
using patools.Enums;
using patools.Models;
using patools.Services.Authentication;
using patools.Services.Courses;
using patools.Services.CourseUsers;
using patools.Services.Experts;
using patools.Services.Files;
using patools.Services.Submissions;
using patools.Services.Users;
using patools.Services.PeeringTasks;
using patools.Services.Reviews;
using System.Reflection;
using System.IO;
using Microsoft.OpenApi.Models;

namespace patools
{
    public class Startup
    {
        public static string ConnectionString { get; private set; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnectionString = Configuration["ConnectionStrings:Default"];
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            SetupJwtServices(services);

            services.AddHttpClient();

            services.AddMvc();

            services.AddHangfire(h => h.UsePostgreSqlStorage(Configuration["ConnectionStrings:Hangfire"]));
            services.AddHangfireServer();
            services.AddControllersWithViews();
            services.AddDbContext<PAToolsContext>();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddAutoMapper(typeof(Startup));
            services.AddScoped<IAuthenticationService,AuthenticationService>();
            services.AddScoped<ICoursesService,CoursesService>();
            services.AddScoped<IUsersService,UsersService>();
            services.AddScoped<IPeeringTasksService,PeeringTasksService>();
            services.AddScoped<ISubmissionsService, SubmissionsService>();
            services.AddScoped<ICourseUsersService, CourseUsersService>();
            services.AddScoped<IExpertsService, ExpertsService>();
            services.AddScoped<IReviewsService, ReviewsService>();
            services.AddScoped<IFilesService, FilesService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "MIEM Peering",
                    Description = "Платформа для интеграции экспертной самостоятельной и пиринговой оценки эссе"
                    /*
                    TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Shayne Boyer",
                        Email = string.Empty,
                        Url = new Uri("https://twitter.com/spboyer"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Use under LICX",
                        Url = new Uri("https://example.com/license"),
                    }
                    */
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MIEM Peering");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            //app.UseHangfireDashboard("/hangfire-secret-link");
            
            app.UseHangfireDashboard("/hangfire-secret-link", new DashboardOptions
            {
                Authorization = new [] { new MyAuthorizationFilter() }
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private void SetupJwtServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:TokenSecret").Value))
                        };
                    });
        }
    }
    
    public class MyAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();

            // Allow all authenticated users to see the Dashboard (potentially dangerous).
            //return httpContext.User.Identity.IsAuthenticated && httpContext.User.IsInRole(UserRoles.Teacher.ToString());
            return true;
        }
    }
}
