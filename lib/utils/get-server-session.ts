import { headers } from "next/headers";
import { auth } from "../../auth";

export default async function GetServerSession() {
    return await auth.api.getSession({headers: await headers() });
}