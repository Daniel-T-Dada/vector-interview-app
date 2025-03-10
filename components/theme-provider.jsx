"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "system", setTheme: () => null });

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vector-theme",
    ...props
}) {
    // Use a function for initial state to avoid hydration mismatch
    const [theme, setTheme] = useState(() => {
        // During SSR, return the default theme
        if (typeof window === "undefined") return defaultTheme;

        // In the browser, try to get the saved theme
        try {
            const savedTheme = localStorage.getItem(storageKey);
            return savedTheme || defaultTheme;
        } catch (error) {
            console.error("Error reading theme from localStorage:", error);
            return defaultTheme;
        }
    });

    const [mounted, setMounted] = useState(false);

    // Mark component as mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update the HTML class and localStorage when theme changes
    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            localStorage.setItem(storageKey, theme);
            return;
        }

        root.classList.add(theme);
        localStorage.setItem(storageKey, theme);
    }, [theme, mounted, storageKey]);

    // Handle system theme changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "system") {
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(mediaQuery.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, mounted]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
        },
    };

    // Return children directly during SSR or first render to avoid hydration issues
    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}; 