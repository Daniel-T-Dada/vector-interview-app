import { NextResponse } from "next/server";
import { getAllUsers, getUserCount } from "@/lib/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        console.log("Users API route called");

        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        console.log("Session in users API:", session?.user?.email);

        if (!session) {
            console.log("No session found, returning unauthorized");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get all users
        const users = getAllUsers();
        const count = getUserCount();
        console.log(`Retrieved ${count} users from database`);

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