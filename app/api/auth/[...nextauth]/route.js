import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/users";

// Mock user database for demonstration purposes
const users = [
    {
        id: "1",
        name: "Demo User",
        email: "user@example.com",
        password: "password123",
    },
];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Use our authenticateUser function to check credentials
                const user = authenticateUser(credentials.email, credentials.password);

                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signUp: "/auth/signup",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
            }
            if (profile) {
                token.id = profile.sub || profile.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 