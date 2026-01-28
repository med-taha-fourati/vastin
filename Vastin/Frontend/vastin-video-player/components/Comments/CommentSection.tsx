"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Avatar,
    Skeleton,
    Alert
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { Comment } from "@/types/Comment";
import { useAuth } from "@/context/AuthContext";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
    videoId: number;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments/video/${videoId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (err) {
            setError("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const handleDelete = async (commentId: number) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== commentId));
            }
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Comments ({comments.length})
            </Typography>

            <CommentForm videoId={videoId} onCommentAdded={fetchComments} />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Box key={i} sx={{ display: 'flex', mb: 3 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton width="30%" />
                                <Skeleton width="100%" />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : comments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography color="text.secondary">
                        No comments yet. Be the first to comment!
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    {comments.map((comment) => (
                        <Paper
                            key={comment.id}
                            sx={{
                                p: 2,
                                mb: 2,
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'start' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                    {comment.commentOwner.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {comment.commentOwner.username}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTimeAgo(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                        {user && user.id === comment.commentOwner.id && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(comment.id)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {comment.content}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
}
