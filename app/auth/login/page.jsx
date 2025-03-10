"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { FormError } from "@/components/ui/form-error";

// Form validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(() => {
        // Check for error in URL params (from NextAuth)
        const errorParam = searchParams.get("error");
        if (errorParam === "OAuthAccountNotLinked") {
            return "This email is already associated with another account. Please sign in using a different method.";
        } else if (errorParam) {
            return "An error occurred during sign in. Please try again.";
        }
        return "";
    });
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            router.push("/dashboard");
        } catch (error) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            setError("");
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("Google sign in error:", error);
            setError("Failed to sign in with Google. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-8">
            <div className="w-full max-w-md">
                <Card className="shadow-lg border-t-4 border-t-primary">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full relative overflow-hidden group"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                        >
                            <div className="absolute inset-0 w-3 bg-primary transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                            {googleLoading ? (
                                <>
                                    <Spinner size="sm" className="mr-2" />
                                    <span>Connecting to Google...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 mr-2"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151M12.545 12.151L12.545 12.151L12.545 12.151M12.545 12.151L12.545 12.151L12.545 12.151M22.545 12.151C22.545 11.407 22.475 10.688 22.345 9.995H12.545V13.751H18.185C17.965 14.969 17.225 16.019 16.115 16.699V19.129H19.425C21.445 17.259 22.545 14.945 22.545 12.151Z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12.545 22.505C15.325 22.505 17.675 21.595 19.425 19.129L16.115 16.699C15.165 17.339 13.945 17.699 12.545 17.699C9.875 17.699 7.625 15.909 6.805 13.479H3.385V15.989C5.125 19.759 8.555 22.505 12.545 22.505Z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M6.805 13.479C6.615 12.839 6.505 12.159 6.505 11.459C6.505 10.759 6.615 10.079 6.805 9.439V6.929H3.385C2.525 8.619 2.005 10.489 2.005 12.459C2.005 14.429 2.525 16.299 3.385 17.989L6.805 15.479V13.479Z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12.545 5.219C13.935 5.219 15.175 5.699 16.165 6.639L19.105 3.699C17.665 2.369 15.325 1.499 12.545 1.499C8.555 1.499 5.125 4.249 3.385 8.019L6.805 10.529C7.625 8.099 9.875 6.309 12.545 6.309V5.219Z"
                                        />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 font-medium">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-10"
                                    {...register("email")}
                                />
                                <FormError message={errors.email?.message} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    className="h-10"
                                    {...register("password")}
                                />
                                <FormError message={errors.password?.message} />
                            </div>
                            <Button
                                type="submit"
                                className="w-full relative overflow-hidden group"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 w-3 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-6 pt-2">
                        <p className="text-sm font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 