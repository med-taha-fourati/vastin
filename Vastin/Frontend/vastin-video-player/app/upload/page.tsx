"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    LinearProgress,
    Alert,
    ThemeProvider,
    createTheme,
    CssBaseline,
    MenuItem,
    Select
} from "@mui/material";
import { CloudUpload, FileVideo, CheckCircle, AlertCircle } from "lucide-react";
import { Funnel_Display } from "next/font/google";
import { darkColorScheme } from "@/lib/colorScheme";

const funnelDisplay = Funnel_Display({ subsets: ["latin"] });

const darkTheme = createTheme({
    typography: {
        fontFamily: funnelDisplay.style.fontFamily,
    },
    palette: {
        mode: "dark",
        primary: { main: `#${darkColorScheme.accent}` },
        background: {
            default: `#${darkColorScheme.dark}`,
            paper: `#${darkColorScheme.light}`,
        },
        text: {
            primary: "#ffffff",
            secondary: "#b3b3b3",
        },
    },
});

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [duration, setDuration] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("Public");
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Container maxWidth="md" sx={{ pt: 12, pb: 8, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">Loading...</Typography>
                </Container>
            </ThemeProvider>
        );
    }

    if (!user) {
        return null;
    }

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("video/")) {
            setError("Please upload a valid video file.");
            return;
        }

        if (selectedFile.size > 500 * 1024 * 1024) {
            setError("File size exceeds 500MB limit.");
            return;
        }

        setFile(selectedFile);
        setError("");

        // Extract duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            setDuration(Math.floor(video.duration));
        }
        video.src = URL.createObjectURL(selectedFile);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file || !title) return;

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("File", file);
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("Length", duration.toString());
        formData.append("Visibility", visibility);
        formData.append("Owner.Username", user.username);
        // Owner logic handled by backend via JWT

        try {
            const res = await fetch("/api/videos", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Upload failed");
            }

            const data = await res.json();
            setUploadSuccess(true);

            // Redirect after short delay
            setTimeout(() => {
                router.push(`/watch/${data.id}`);
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ pt: 12, pb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.1)',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
                        Upload Video
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} icon={<AlertCircle />}>
                            {error}
                        </Alert>
                    )}

                    {uploadSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                            Upload successful! Redirecting...
                        </Alert>
                    )}

                    {!file ? (
                        <Box
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            sx={{
                                border: `2px dashed ${dragActive ? darkColorScheme.accent : '#555'}`,
                                borderRadius: 3,
                                p: 6,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: dragActive ? 'rgba(35, 181, 211, 0.1)' : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: darkColorScheme.accent,
                                    bgcolor: 'rgba(35, 181, 211, 0.05)'
                                }
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleChange}
                                style={{ display: "none" }}
                            />
                            <CloudUpload size={48} className="mx-auto mb-4 text-gray-400" />
                            <Typography variant="h6" color="text.primary">
                                Drag & drop video here
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                or click to select file
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                Supports MP4, WebM (Max 500MB)
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 2 }}>
                                <FileVideo size={32} className="mr-3 text-blue-400" />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" noWrap>{file.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {(file.size / (1024 * 1024)).toFixed(1)} MB • {duration > 0 ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : 'Calculating...'}
                                    </Typography>
                                </Box>
                                <Button size="small" onClick={() => setFile(null)} disabled={uploading}>
                                    Change
                                </Button>
                            </Box>

                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows={4}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                margin="normal"
                                variant="outlined"
                            >
                                <MenuItem value="Public">Public</MenuItem>
                                <MenuItem value="Unlisted">Unlisted</MenuItem>
                                <MenuItem value="Private">Private</MenuItem>
                            </TextField>

                            {uploading && <LinearProgress sx={{ mt: 2, mb: 1 }} />}

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={uploading || !title}
                                sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
                            >
                                {uploading ? "Uploading..." : "Upload Video"}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}
