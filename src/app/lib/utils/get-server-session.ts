import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { cache } from "react";
import { redirect } from 'next/navigation';

export const GetServerSession = cache(async () => {
    const session = await auth.api.getSession({headers: await headers() });

    if(!session) {
        redirect('/unauthorized');
    }

    return session;
});
