"use client";

import Threads from "@/components/ThreadsBackground/Threads";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { MoveRight } from "lucide-react";
import { useState } from "react";

export default function Login() {
    return (
        <div className="relative w-screen h-screen bg-[#060010] overflow-hidden flex items-center justify-center">

            {/* these colors work like opengl colors (cuz its webgl duhh....) */}
            <div className="absolute inset-0 z-0">
                <Threads color={[0.32, 0.15, 1.00]} />
            </div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                <SpotlightCard className="p-8 backdrop-blur-sm bg-black/40 border-white/10">
                    <div className="flex flex-col space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className={`text-3xl font-bold text-white tracking-wider`}>
                                Welcome Back
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button className="group w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
                            Sign In
                            <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>

                        <div className="text-center">
                            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
}