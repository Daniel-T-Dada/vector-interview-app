"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UsersPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/auth/login");
        },
    });

    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setUsers(data.users);
                setCount(data.count);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchUsers();
        }
    }, [status]);

    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-lg">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4 py-6 md:py-8">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">User Data</h1>
                    <div className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                        Total Users: <span className="font-bold">{count}</span>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 mb-8">
                    <Card className="border-t-4 border-t-primary shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center">
                                <span className="bg-primary/10 p-2 rounded-full mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </span>
                                User Statistics
                            </CardTitle>
                            <CardDescription>Overview of registered users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <p className="text-sm font-medium">Total Users</p>
                                    <p className="text-3xl font-bold">{count}</p>
                                </div>
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <p className="text-sm font-medium">Latest User</p>
                                    <p className="text-lg font-medium truncate">
                                        {users.length > 0 ? users[users.length - 1].name : "None"}
                                    </p>
                                </div>
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <p className="text-sm font-medium">Current User</p>
                                    <p className="text-lg font-medium truncate">{session?.user?.name || session?.user?.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-t-4 border-t-blue-500 shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center">
                            <span className="bg-blue-500/10 p-2 rounded-full mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </span>
                            Registered Users
                        </CardTitle>
                        <CardDescription>List of all registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" x2="12" y1="8" y2="12"></line>
                                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                </svg>
                                <p className="font-medium">No users found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-6">
                                <table className="w-full border-collapse min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider">ID</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider">Name</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider">Email</th>
                                            <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="py-3 px-6 whitespace-nowrap">{user.id}</td>
                                                <td className="py-3 px-6 whitespace-nowrap font-medium">{user.name}</td>
                                                <td className="py-3 px-6 whitespace-nowrap">{user.email}</td>
                                                <td className="py-3 px-6 whitespace-nowrap text-sm font-medium">
                                                    {new Date(user.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 