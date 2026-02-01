import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/types/url";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const response = await fetch(`${BASE_URL}/user/login`, {
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
        
        const res = NextResponse.json({
            id: data.id,
            username: data.username,
        });
        
        res.cookies.set("token", data.token, {
            httpOnly: true,
            secure: false,
            //secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        });

        return res;

    } catch (error) {
        console.error("Login Proxy Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}