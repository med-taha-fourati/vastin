import {Box, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import React from "react";
import {Video} from "@/types/Video";

export const VideoCard = (video: Video) => {
    return (
        <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardMedia
                    component="img"
                    height="160"
                    image={video.thumbnailPath}
                    alt={video.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" fontSize="1rem" fontWeight="bold" gutterBottom>
                        {video.title}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="text.secondary">
                            {video.owner.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {video.length.toString()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
}