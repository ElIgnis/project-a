import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { cache } from "react";

export const GetServerSession = cache(async () => {
    return await auth.api.getSession({headers: await headers() });
});
