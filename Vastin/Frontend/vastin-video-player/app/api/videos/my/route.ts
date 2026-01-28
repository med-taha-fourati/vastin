import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const response = await fetch(`${BASE_URL}/video/my`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return new NextResponse("Error fetching videos", { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
