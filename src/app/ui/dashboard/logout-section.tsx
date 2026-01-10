'use client'

import { Button } from '@/app/ui/button';
import {
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { logout } from '@/app/lib/client-actions'

export function LogoutSection() {

    return (
        <div>
            <p>Dashboard Page</p>
            <Button onClick={logout} className="mt-4 w-1/6">
                Logout <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
        </div>
    );
}