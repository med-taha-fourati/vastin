using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Vastin.Service;

public class VideoStream
{
    private readonly IWebHostEnvironment _env;

    public VideoStream(IWebHostEnvironment env)
    {
        _env = env;
    }

    private string GetVideoPath(string fileName)
    {
        return Path.Combine(_env.WebRootPath, "videos", fileName);
    }

    public async Task StreamVideoAsync(HttpResponse response, string fileName)
    {
        var filePath = GetVideoPath(fileName);

        if (!File.Exists(filePath))
            throw new FileNotFoundException();

        response.StatusCode = StatusCodes.Status200OK;
        response.ContentType = "video/mp4";
        response.Headers.Add("Accept-Ranges", "bytes");

        const int bufferSize = 64 * 1024;
        var buffer = new byte[bufferSize];

        await using var fileStream = new FileStream(
            filePath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read
        );

        int bytesRead;
        while ((bytesRead = await fileStream.ReadAsync(buffer)) > 0)
        {
            await response.Body.WriteAsync(buffer.AsMemory(0, bytesRead));
            await response.Body.FlushAsync();
        }
    }

    public async Task<string> SaveVideoAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new InvalidOperationException("Empty file");

        if (!file.ContentType.Equals("video/mp4"))
            throw new InvalidOperationException("Only MP4 files are allowed");

        var videosDir = Path.Combine(_env.WebRootPath, "videos");
        Directory.CreateDirectory(videosDir);

        var fileName = $"{Guid.NewGuid()}.mp4";
        var filePath = GetVideoPath(fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return fileName;
    }

    public async Task DeleteVideoAsync(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return;

        var filePath = GetVideoPath(fileName);

        if (File.Exists(filePath))
        {
            await Task.Run(() => File.Delete(filePath));
        }
    }

    public async Task<string> ReplaceVideoAsync(string oldFileName, IFormFile newFile)
    {
        // Save the new video first
        var newFileName = await SaveVideoAsync(newFile);

        // Delete the old video
        await DeleteVideoAsync(oldFileName);

        return newFileName;
    }
}