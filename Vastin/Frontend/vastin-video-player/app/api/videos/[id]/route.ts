import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";
import { cookies } from "next/headers";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const response = await fetch(`${BASE_URL}/video/metadata/${id}`, {
        cache: "no-store"
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return new NextResponse("Unauthorized", { status: 401 });

        const response = await fetch(`${BASE_URL}/video/${params.id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) return new NextResponse("Backend Error", { status: response.status });

        return new NextResponse(null, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
