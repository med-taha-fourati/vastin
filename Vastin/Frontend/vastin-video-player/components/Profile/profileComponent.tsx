"use client";

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Avatar,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Paper,
} from "@mui/material";
import {VideoCard} from "@/components/VideoCard/VideoCard";
import {Video} from "@/types/Video";

const PLACEHOLDER_USER = {
    name: "Alexandro Del Janiero",
    avatar: "https://i.pravatar.cc/150?u=alex",
};

const PLACEHOLDER_VIDEOS: Video[] = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Creative Process Vol. ${i + 1}`,
    thumbnailPath: `https://picsum.photos/seed/${i + 10}/300/200`,
    owner: {id: 3, username: "trbsh", password: "bruh"},
    description: "ldskfjadslfjasdf",
    length: 3,
    videoPath: "sdalkfjalsdf"
}));

const PLACEHOLDER_COMMENTS = Array.from({ length: 0 }).map((_, i) => ({
    id: i,
    user: `User${Math.floor(Math.random() * 1000)}`,
    avatar: `https://i.pravatar.cc/150?u=${i + 20}`,
    text: "This is absolutely stunning! love the composition and colors used in this piece.",
    time: "2 hours ago",
}));

export default function ProfileComponent() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: "transparent" }}>
                <Box display="flex" flexDirection="row" alignItems="center" textAlign="center">
                    <Avatar
                        src={PLACEHOLDER_USER.avatar}
                        alt={PLACEHOLDER_USER.name}
                        sx={{ width: 120, height: 120, mr: 6 }}
                    />
                    <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                        {PLACEHOLDER_USER.name}
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Videos" />
                    <Tab label="Comments" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {PLACEHOLDER_VIDEOS.map((video) => (
                                <VideoCard id={video.id} 
                                           title={video.title} 
                                           description={video.description} 
                                           length={video.length} 
                                           videoPath={video.videoPath} 
                                           thumbnailPath={video.thumbnailPath} 
                                           owner={video.owner} />
                            ))}
                        </Grid>
                    )}

                    {tabValue === 1 && (
                        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                            {PLACEHOLDER_COMMENTS.map((comment, index) => (
                                <React.Fragment key={comment.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt={comment.user} src={comment.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography component="span" variant="subtitle2" fontWeight="bold">
                                                        {comment.user}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {comment.time}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ display: "inline", mt: 0.5 }}
                                                >
                                                    {comment.text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    {index < PLACEHOLDER_COMMENTS.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            </Box>
        </>
    );
}
