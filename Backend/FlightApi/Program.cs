using FlightApi.Data;
using FlightApi.Models;

var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddCors();
builder.Services.AddDbContext<FlightDbContext>();
builder.Services.AddTransient<FlightModel>();
builder.Services.AddControllers();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(
    builder =>
        builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
);
app.UseHttpsRedirection();
app.MapDefaultControllerRoute();
app.Run();

