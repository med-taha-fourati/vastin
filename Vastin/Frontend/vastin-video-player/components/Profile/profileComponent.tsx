"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Tabs,
    Tab,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton
} from "@mui/material";
import { Upload, Trash2 } from "lucide-react";
import {Video, visibilityResolver} from "@/types/Video";
import { BASE_URL } from "@/types/url";
import { useAuth } from "@/context/AuthContext";

export default function ProfileComponent() {
    const { user: currentUser } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (tabValue === 0 && currentUser) {
            fetchUserVideos();
        }
    }, [tabValue, currentUser]);

    const fetchUserVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/videos/my");
            if (res.ok) {
                const userVideos: Video[] = await res.json();
                setVideos(userVideos); // No filtering needed, backend handles it
            }
        } catch (error) {
            console.error("Failed to fetch user videos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (videoId: number) => {
        setVideoToDelete(videoId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!videoToDelete) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/videos/${videoToDelete}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setVideos(prev => prev.filter(v => Number(v.id) !== videoToDelete));
                setDeleteDialogOpen(false);
                setVideoToDelete(null);
            } else {
                console.error("Delete failed");
            }
        } catch (error) {
            console.error("Error deleting video", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!currentUser) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    Please log in to view your profile
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: "transparent" }}>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Avatar
                            sx={{ width: 120, height: 120, mr: 4, bgcolor: 'primary.main' }}
                        >
                            {currentUser.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {currentUser.username}
                        </Typography>
                    </Box>
                    <Link href="/upload" passHref>
                        <Button
                            variant="contained"
                            startIcon={<Upload size={20} />}
                            sx={{ height: 'fit-content' }}
                        >
                            Upload Video
                        </Button>
                    </Link>
                </Box>
            </Paper>

            <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label={`My Videos (${videos.length})`} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <>
                            {loading ? (
                                <Grid container spacing={3}>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                                            <Card>
                                                <Skeleton variant="rectangular" height={160} />
                                                <CardContent>
                                                    <Skeleton width="80%" />
                                                    <Skeleton width="60%" />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : videos.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No videos yet
                                    </Typography>
                                    <Link href="/upload" passHref>
                                        <Button variant="outlined" sx={{ mt: 2 }}>
                                            Upload Your First Video
                                        </Button>
                                    </Link>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {videos.map((video) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={Number(video.id)}>
                                            <Card sx={{ position: 'relative', height: '100%' }}>
                                                <Link href={`/watch/${video.id}`} passHref style={{ textDecoration: 'none' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="160"
                                                        image={video.thumbnailPath || "/placeholder.jpg"}
                                                        sx={{ cursor: 'pointer' }}
                                                    />
                                                </Link>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight={600}
                                                                noWrap
                                                                color="text.primary"
                                                            >
                                                                {video.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {visibilityResolver(video.visibility)} • {new Date(video.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteClick(Number(video.id))}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Video</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this video? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
