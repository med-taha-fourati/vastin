"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { Video } from "@/types/Video";
import {
    Box,
    Typography,
    Container,
    Paper,
    Avatar,
    Divider,
    Skeleton,
    ThemeProvider,
    createTheme,
    CssBaseline,
    IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ArrowLeft, User, Share2, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { darkColorScheme, lightColorScheme } from "@/lib/colorScheme";
import { Funnel_Display } from "next/font/google";
import CommentSection from "@/components/Comments/CommentSection";

const funnelDisplay = Funnel_Display({ subsets: ["latin"] });

function WatchContent() {
    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const theme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: funnelDisplay.style.fontFamily,
                },
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? `#${darkColorScheme.accent}` : `#${lightColorScheme.accent}`,
                    },
                    secondary: {
                        main: mode === "dark" ? `#${darkColorScheme.highlight}` : `#${lightColorScheme.highlight}`,
                    },
                    background: {
                        default: mode === "dark" ? `#${darkColorScheme.light}` : `#${lightColorScheme.light}`,
                        paper: mode === "dark" ? `#${darkColorScheme.light}` : `#${lightColorScheme.light}`,
                    },
                    text: {
                        primary: mode === "dark" ? `#${darkColorScheme.dark}` : `#${lightColorScheme.dark}`,
                        secondary: mode === "dark" ? `#${darkColorScheme.base}` : `#${lightColorScheme.base}`,
                    },
                },
            }),
        [mode]
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const id = mounted ? (params.id as string) : null;

    useEffect(() => {
        if (!id) return;

        const fetchVideo = async () => {
            try {
                const res = await fetch(`/api/videos/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setVideo(data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    if (!mounted) return null;

    if (!id) {
        return <Typography>No video selected</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 9, pb: 4 }}>
                <Link href="/explore">
                    <Box sx={{ display: "flex", 
                        alignItems: "center", 
                        mb: 2, cursor: "pointer", color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                        <ArrowLeft size={20} />
                        <Typography sx={{ ml: 1 }}>Back to Explore</Typography>
                    </Box>
                </Link>

                <Grid spacing={4}>
                    <Grid xs={12} md={4} >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "56.25%",
                                borderRadius: 3,
                                overflow: "hidden",
                                bgcolor: "black",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%"
                                }}
                            >
                                <VideoPlayer
                                    src={`/api/stream/${id}`}
                                    poster={video?.thumbnailPath}
                                    autoplay={true}
                                    width="100%"
                                    height="100%"
                                />
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="text" height={40} width="70%" />
                                <Skeleton variant="text" height={20} width="40%" />
                            </Box>
                        ) : video ? (
                            <>
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {video.title}
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                                                <User size={20} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {video.owner?.username || "Unknown User"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : "Unknown Date"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <IconButton sx={{ bgcolor: "action.hover" }}>
                                                <ThumbsUp size={20} />
                                            </IconButton>
                                            <IconButton sx={{ bgcolor: "action.hover" }}>
                                                <Share2 size={20} />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Paper sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Description
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                            {video.description || "No description provided."}
                                        </Typography>
                                    </Paper>
                                </Box>
                                <CommentSection videoId={video.id} />
                            </>
                        ) : (
                            <Typography color="error" sx={{ mt: 2 }}>Video not found</Typography>
                        )}
                    </Grid>

                    {/*<Grid xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Up Next
                        </Typography>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <Skeleton variant="rectangular" width={160} height={90} sx={{ borderRadius: 1 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="90%" />
                                    <Skeleton variant="text" width="60%" />
                                </Box>
                            </Box>
                        ))}
                    </Grid>*/}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default function Watch() {
    return <WatchContent />;
}
