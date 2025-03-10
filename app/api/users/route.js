import { NextResponse } from "next/server";
import { getAllUsers, getUserCount } from "@/lib/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get all users
        const users = getAllUsers();
        const count = getUserCount();

        // Return users
        return NextResponse.json({
            users,
            count,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 