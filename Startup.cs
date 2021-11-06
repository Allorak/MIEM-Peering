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
using patools.Models;

namespace patools
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            SetupJWTServices(services);
            services.AddControllersWithViews();
            services.AddDbContext<PAToolsContext>();
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();  
            app.UseAuthorization(); 
            //app.UseGoogleAuthentication();

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

        private void SetupJWTServices(IServiceCollection services)  
        {  
            string key = "M13m_S3cr3T-t0k3N"; //this should be same which is used while creating token 
            List<string> issuers = new List<string>(){"http://localhost:5000","accounts.google.com"};
            IConfigurationSection googleAuthNSection = Configuration.GetSection("Authentication:Google");
            List<string> audiences = new List<string>(){"http://localhost:5000",$"{googleAuthNSection["ClientId"]}"};
            services.AddAuthentication()  
            /*.AddJwtBearer(options =>  
            {  
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters  
                {  
                    ValidateIssuer = true,  
                    ValidateAudience = true,  
                    ValidateIssuerSigningKey = true,  
                    ValidIssuers = issuers,
                    ValidAudiences = audiences,  
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))  
                };  
    
                options.Events = new JwtBearerEvents  
                {  
                    OnAuthenticationFailed = context =>  
                    {  
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))  
                        {  
                            context.Response.Headers.Add("Token-Expired", "true");  
                        }  
                        return System.Threading.Tasks.Task.CompletedTask;  
                    }  
                };  
            })*/
            .AddGoogle(options =>
            {
                IConfigurationSection googleAuthNSection =
                    Configuration.GetSection("Authentication:Google");

                options.ClientId = googleAuthNSection["ClientId"];
                options.ClientSecret = googleAuthNSection["ClientSecret"];
            });  
        }  

    }
}
