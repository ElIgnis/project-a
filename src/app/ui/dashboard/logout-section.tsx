'use client'

import { Button } from '@/app/ui/button';
import { LuArrowRightFromLine  } from "react-icons/lu";
import { logout } from '@/app/lib/user-client-actions'

export function LogoutSection() {

    return (
        <div>
            <button 
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-blue-900 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            onClick={logout}
            >
            <div>Logout</div>
             <LuArrowRightFromLine className="w-6" />
          </button>
        </div>
    );
}