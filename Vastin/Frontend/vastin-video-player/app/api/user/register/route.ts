import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const jsonError = JSON.parse(errorText);
                return NextResponse.json(jsonError, { status: response.status });
            } catch {
                return new NextResponse(errorText, { status: response.status });
            }
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Register Proxy Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
