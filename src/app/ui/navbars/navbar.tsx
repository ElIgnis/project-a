'use client'

import { LuMenu , LuX  } from 'react-icons/lu';
import {LogoutSection} from '@/app/ui/dashboard/logout-section'
import { useState } from 'react';
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
      <div className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold">Simple Posting Board</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block w-full">
              <div className="ml-10 flex items-center justify-between space-x-6">
                <div className="justify-center">
                  <Link
                    href="/dashboard/topics-board"
                    className="px-3 py-2 flex rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
                    >
                        Topics
                  </Link>
                  {/* <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                    About
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                    Services
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                    Contact
                  </button> */}
                </div>
                <LogoutSection/>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              >
                {isOpen ? <LuX className="w-6" /> : <LuMenu className="w-6"/>}
              </button>
              
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors">
                  Home
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors">
                  About
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors">
                  Services
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors">
                  Contact
                </button>
                <LogoutSection/>
              </div>
            </div>
          )}
      </div>
  );
}