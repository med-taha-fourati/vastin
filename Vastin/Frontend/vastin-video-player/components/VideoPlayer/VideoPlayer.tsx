"use client";

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoplay?: boolean;
    controls?: boolean;
    width?: string | number;
    height?: string | number;
    className?: string;
    onReady?: (player: Player) => void;
}

export const VideoPlayer = ({
    src,
    poster,
    autoplay = false,
    controls = true,
    width,
    height,
    className,
    onReady
}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-big-play-centered');

            if (className) {
                // Add tailwind or custom classes
                className.split(' ').forEach(c => videoElement.classList.add(c));
            }

            videoRef.current?.appendChild(videoElement);

            const options = {
                autoplay,
                controls,
                responsive: true,
                fluid: true,
                poster,
                sources: [{
                    src,
                    type: 'video/mp4' // TODO: Detect type from src extension or headers?
                }]
            };

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

        } else {
            const player = playerRef.current;
            player.autoplay(autoplay);
            player.src([{ src, type: 'video/mp4' }]);
            if (poster) player.poster(poster);
        }
    }, [src, poster, autoplay, controls, onReady, className]);

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player ref={videoRef} className="w-full h-full" />
    );
}

export default VideoPlayer;
