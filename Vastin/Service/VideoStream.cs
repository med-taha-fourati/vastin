using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Vastin.Service;

public class VideoStream
{
    private readonly IWebHostEnvironment _env;
    private const long MaxFileSize = 500 * 1024 * 1024; // 512MB
    private static readonly string[] AllowedMimeTypes = { "video/mp4", "video/webm", "video/quicktime" };

    public VideoStream(IWebHostEnvironment env)
    {
        _env = env;
    }

    private string GetVideoPath(string fileName)
    {
        var sanitizedFileName = Path.GetFileName(fileName);
        return Path.Combine(_env.WebRootPath, "videos", sanitizedFileName);
    }

    public async Task StreamVideoAsync(HttpResponse response, string fileName)
    {
        var filePath = GetVideoPath(fileName);

        if (!File.Exists(filePath))
            throw new FileNotFoundException("Video file not found");

        var fileInfo = new FileInfo(filePath);
        var fileLength = fileInfo.Length;

        var mimeType = GetMimeType(filePath);
        response.ContentType = mimeType;
        response.Headers.Append("Accept-Ranges", "bytes");

        var rangeHeader = response.HttpContext.Request.Headers["Range"].ToString();

        if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes="))
        {
            var range = rangeHeader.Replace("bytes=", "").Split('-');
            var start = long.Parse(range[0]);
            var end = range.Length > 1 && !string.IsNullOrEmpty(range[1]) 
                ? long.Parse(range[1]) 
                : fileLength - 1;

            if (start >= fileLength || end >= fileLength)
            {
                response.StatusCode = StatusCodes.Status416RangeNotSatisfiable;
                response.Headers.Append("Content-Range", $"bytes */{fileLength}");
                return;
            }

            var contentLength = end - start + 1;

            response.StatusCode = StatusCodes.Status206PartialContent;
            response.Headers.Append("Content-Range", $"bytes {start}-{end}/{fileLength}");
            response.ContentLength = contentLength;

            await using var fileStream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read
            );

            fileStream.Seek(start, SeekOrigin.Begin);

            const int bufferSize = 64 * 1024;
            var buffer = new byte[bufferSize];
            var bytesToRead = contentLength;

            while (bytesToRead > 0)
            {
                var bytesRead = await fileStream.ReadAsync(buffer.AsMemory(0, (int)Math.Min(bufferSize, bytesToRead)));
                if (bytesRead == 0) break;

                await response.Body.WriteAsync(buffer.AsMemory(0, bytesRead));
                await response.Body.FlushAsync();
                bytesToRead -= bytesRead;
            }
        }
        else
        {
            response.StatusCode = StatusCodes.Status200OK;
            response.ContentLength = fileLength;

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
    }

    public async Task<string> SaveVideoAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new InvalidOperationException("Empty file");

        if (file.Length > MaxFileSize)
            throw new InvalidOperationException($"File size exceeds maximum allowed size of {MaxFileSize / (1024 * 1024)}MB");

        if (!AllowedMimeTypes.Contains(file.ContentType))
            throw new InvalidOperationException($"Only video files are allowed (mp4, webm, mov)");

        var videosDir = Path.Combine(_env.WebRootPath, "videos");
        Directory.CreateDirectory(videosDir);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
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
        var newFileName = await SaveVideoAsync(newFile);
        await DeleteVideoAsync(oldFileName);
        return newFileName;
    }

    private string GetMimeType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".mov" => "video/quicktime",
            _ => "application/octet-stream"
        };
    }
}