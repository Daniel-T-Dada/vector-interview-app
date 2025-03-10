"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav
            className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-all duration-200 ${scrolled ? "shadow-sm" : ""
                }`}
        >
            <div className="flex justify-center w-full">
                <div className="w-full max-w-6xl px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="text-xl font-bold flex items-center space-x-2">
                            <span className="hidden sm:inline">Vector Interview</span>
                            <span className="sm:hidden">Vector</span>
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>

                        {/* Desktop navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm truncate max-w-[150px] lg:max-w-xs">
                                        {session?.user?.name || session?.user?.email}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                        size="sm"
                                        className="whitespace-nowrap"
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" asChild size="sm">
                                        <Link href="/auth/login">Login</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href="/auth/signup">Sign Up</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile navigation - Positioned absolutely to overlay content */}
            <div
                className={`
                    absolute left-0 right-0 top-16 md:hidden 
                    bg-background/95 backdrop-blur-sm shadow-md border-b
                    transform transition-all duration-300 ease-in-out z-40
                    ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                `}
            >
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
                    <div className="flex justify-center">
                        <ThemeToggle />
                    </div>

                    {isAuthenticated ? (
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-sm text-center">
                                {session?.user?.name || session?.user?.email}
                            </span>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    signOut({ callbackUrl: "/auth/login" });
                                    toggleMenu();
                                }}
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                                onClick={toggleMenu}
                            >
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button
                                className="w-full"
                                asChild
                                onClick={toggleMenu}
                            >
                                <Link href="/auth/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
} 