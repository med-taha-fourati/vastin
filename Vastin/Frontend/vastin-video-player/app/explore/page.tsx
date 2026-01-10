"use client";

import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Card,
    CardMedia,
    Grid,
    CardContent,
    Button,
    Skeleton
} from "@mui/material";
import { Video } from "@/types/Video";

export default function Explore() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVideos([]);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#0b0b0b" }}>
            <Box
                sx={{
                    width: 220,
                    backgroundColor: "#111",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    gap: 2
                }}
            >
                <Button variant="contained" sx={{ justifyContent: "flex-start" }}>
                    Explore
                </Button>
                <Button variant="outlined" sx={{ justifyContent: "flex-start", color: "white", borderColor: "white" }}>
                    Profile
                </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: "#111" }}>
                    <Toolbar>
                        <Typography variant="h6">Vastin</Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 4 }}>
                    {loading && (
                        <Grid container spacing={3}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Grid container xs={12} sm={6} md={4} lg={3} key={i}>
                                    <Card sx={{ backgroundColor: "#1a1a1a" }}>
                                        <Skeleton variant="rectangular" height={160} animation="wave" />
                                        <CardContent>
                                            <Skeleton width="80%" animation="wave" />
                                            <Skeleton width="60%" animation="wave" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {!loading && videos.length === 0 && (
                        <Typography sx={{ color: "white", textAlign: "center", mt: 10, fontSize: 18 }}>
                            no videos have been uploaded to the website, be the first one!
                        </Typography>
                    )}

                    {!loading && videos.length > 0 && (
                        <Grid container spacing={3}>
                            {videos.map((video) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                                    <Card sx={{ backgroundColor: "#1a1a1a", cursor: "pointer" }}>
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={video.thumbnailPath}
                                        />
                                        <CardContent>
                                            <Typography sx={{ color: "white", fontWeight: 600 }}>
                                                {video.title}
                                            </Typography>
                                            <Typography sx={{ color: "#aaa", fontSize: 14 }}>
                                                {video.owner.username}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
