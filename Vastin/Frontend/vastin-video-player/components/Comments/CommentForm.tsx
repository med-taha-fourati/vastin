"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { Send } from "lucide-react";
import {NEXTJS_URL} from "@/types/url";

interface CommentFormProps {
    videoId: number;
    onCommentAdded: () => void;
}

export default function CommentForm({ videoId, onCommentAdded }: CommentFormProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`${NEXTJS_URL}/comments?videoId=${videoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to post comment");
            }

            setContent("");
            onCommentAdded();
        } catch (err: any) {
            setError(err.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, mb: 3 }}>
                <Typography color="text.secondary" align="center">
                    Please log in to comment
                </Typography>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
                fullWidth
                multiline
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                disabled={submitting}
                error={!!error}
                helperText={error}
                sx={{ mb: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={submitting || !content.trim()}
                startIcon={<Send size={18} />}
            >
                {submitting ? "Posting..." : "Post Comment"}
            </Button>
        </Box>
    );
}
