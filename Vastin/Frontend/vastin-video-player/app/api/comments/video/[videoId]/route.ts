import {NextRequest, NextResponse} from "next/server";
import {BASE_URL} from "@/types/url";

export async function GET(req: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
    try {
        const { videoId } = await params;
        
        const res = await fetch(`${BASE_URL}/comment/video/${videoId}`, {
            cache: "no-store"
        });
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ status: 500 });
    }
}