import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import  { getDb }  from "@/../lib/mongodb";

const db = await getDb();
export const auth = betterAuth({
    
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    }, plugins: [ nextCookies() ]
});