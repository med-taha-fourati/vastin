"use client";

import Threads from "@/components/ThreadsBackground/Threads";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import Link from "next/link";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await register(username, password);
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen bg-[#060010] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <Threads color={[0.32, 0.15, 1.00]} />
            </div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                <SpotlightCard className="p-8 backdrop-blur-sm bg-black/40 border-white/10">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-white tracking-wider">
                                Create Account
                            </h1>
                            <p className="text-sm text-neutral-400">
                                Join Vastin today
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300" htmlFor="confirm-password">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                            <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </SpotlightCard>
            </div>
        </div>
    );
}