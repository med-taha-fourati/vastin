import { NEXTJS_URL } from "@/types/url";

export interface AuthUser {
    id: number;
    username: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const res = await fetch(`${NEXTJS_URL}/user/current`, {
            credentials: 'include',
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("Failed to get current user", error);
        return null;
    }
}

export async function login(username: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${NEXTJS_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Login failed');
    }

    return await res.json();
}

export async function register(username: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${NEXTJS_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Registration failed');
    }

    return await res.json();
}

export async function logout(): Promise<void> {
    await fetch(`${NEXTJS_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}
