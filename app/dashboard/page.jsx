"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/auth/login");
        },
    });

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4 py-6 md:py-8">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
                        <Link href="/dashboard/users">View User Data</Link>
                    </Button>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-t-4 border-t-primary shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center">
                                <span className="bg-primary/10 p-2 rounded-full mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </span>
                                Welcome, {session?.user?.name || session?.user?.email}
                            </CardTitle>
                            <CardDescription>You are now signed in to Vector Interview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">This is a protected dashboard page that requires authentication. You can explore the features and manage your account from here.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-blue-500 shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center">
                                <span className="bg-blue-500/10 p-2 rounded-full mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                        <path d="M3 9h18"></path>
                                        <path d="M9 21V9"></path>
                                    </svg>
                                </span>
                                Account Information
                            </CardTitle>
                            <CardDescription>Your profile details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium">Name</span>
                                    <span className="font-medium">{session?.user?.name || "Not provided"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium">Email</span>
                                    <span className="font-medium">{session?.user?.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-500 shadow-md sm:col-span-1 md:col-span-2 lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center">
                                <span className="bg-green-500/10 p-2 rounded-full mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                    </svg>
                                </span>
                                Authentication Method
                            </CardTitle>
                            <CardDescription>How you signed in</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {session?.user?.image ? (
                                    <>
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                            </svg>
                                        </div>
                                        <span className="font-medium">You signed in with Google</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </div>
                                        <span className="font-medium">You signed in with email and password</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 