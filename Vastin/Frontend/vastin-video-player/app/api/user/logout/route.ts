import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async () => {
    (await cookies()).delete('token');
    return NextResponse.json({ message: "Logged out" });
}
