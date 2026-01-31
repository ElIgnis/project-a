import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins"
import { getDb } from "@/app/lib/mongodb";

const db = await getDb();
export const auth = betterAuth({

    database: mongodbAdapter(db),
    basePath: "/api/auth",
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent"
        }
    },
    plugins: [
        username(),
        nextCookies()
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    user: {
        additionalFields: {
            role: {
                type: ["user", "admin"],
                required: false,
                defaultValue: "user",
                input: false,
                returned: false
            },
            lang: {
                type: "string",
                required: false,
                defaultValue: "en"
            }
        }
    }
});

export type User = typeof auth.$Infer.Session.user;