"use client";

import { useState, useEffect } from "react";

export default function TestEnvPage() {
    const [clientId, setClientId] = useState("Loading...");

    useEffect(() => {
        // We'll fetch the client ID from an API route to avoid exposing it client-side
        const fetchEnvVars = async () => {
            try {
                const response = await fetch("/api/test-env");
                const data = await response.json();
                setClientId(data.clientIdPrefix ? `${data.clientIdPrefix}...` : "Not found");
            } catch (error) {
                console.error("Error fetching env vars:", error);
                setClientId("Error loading");
            }
        };

        fetchEnvVars();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-background border rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
                    <p className="mb-2">
                        <strong>GOOGLE_CLIENT_ID:</strong> {clientId}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        Note: For security reasons, we only show the first few characters of the client ID.
                    </p>
                </div>
            </div>
        </div>
    );
} 