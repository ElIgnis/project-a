import { ArrowRightIcon } from "@heroicons/react/24/outline";
import styles from "@/styles/home.module.css";
import { lusitanaFont } from "@/styles/fonts";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52"></div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-row justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-12/12 md:px-20">
                    <div className="grid grid-cols-1 self-center gap-y-4">
                        <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                            <strong>Dashboard website.</strong>
                        </p>
                        <Link
                            href="/login"
                            className="flex justify-center gap-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                        >
                            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                        <Link
                            href="/signup"
                            className="flex justify-center gap-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                        >
                            <span>Sign up</span> <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
