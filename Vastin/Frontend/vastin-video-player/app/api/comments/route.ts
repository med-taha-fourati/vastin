import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get('videoId');

        if (!videoId) {
            return new NextResponse("Video ID required", { status: 400 });
        }

        const body = await req.json();

        const res = await fetch(`${BASE_URL}/comment?videoId=${videoId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cookie': req.headers.get('cookie') || '',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });

        if (!res.ok) {
            const error = await res.text();
            return new NextResponse(error, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
