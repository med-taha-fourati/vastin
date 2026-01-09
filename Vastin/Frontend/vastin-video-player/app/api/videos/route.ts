import { NextRequest } from "next/server";
import { Video } from "@/types/Video";
import {BASE_URL} from "@/types/url";

export const GET = async (req: NextRequest) => {
    try {
        if (req.method !== 'GET') {
            return new Response("Method Not Allowed", { status: 405 });
        }
        
        const request = await fetch(BASE_URL+"/video", {
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