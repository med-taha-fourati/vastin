import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Video } from "@/types/Video";
import { BASE_URL } from "@/types/url";

export const GET = async (req: NextRequest) => {
    try {
        if (req.method !== 'GET') {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const request = await fetch(BASE_URL + "/video", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!request.ok) {
            return new Response("Backend error", { status: request.status });
        }

        const data: Video[] = await request.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();

        const response = await fetch(BASE_URL + "/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Upload proxy error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}