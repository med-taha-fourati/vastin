import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const {id} = await params;
        const response = await fetch(`${BASE_URL}/video/${id}`);

        if (!response.ok) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const headers = new Headers();
        if (response.headers.get("Content-Type")) headers.set("Content-Type", response.headers.get("Content-Type")!);
        if (response.headers.get("Content-Length")) headers.set("Content-Length", response.headers.get("Content-Length")!);
        if (response.headers.get("Content-Range")) headers.set("Content-Range", response.headers.get("Content-Range")!);
        if (response.headers.get("Accept-Ranges")) headers.set("Accept-Ranges", response.headers.get("Accept-Ranges")!);

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
