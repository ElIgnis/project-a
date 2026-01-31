'use client';

import { LuAtSign, LuKey, LuArrowRight, LuArrowLeft, LuUserRound } from "react-icons/lu";
import { Button } from '@/app/ui/button';
import { emailSignup } from '@/app/lib/user-client-actions'
import { SignUpValidationErrors } from '../lib/utils/user-form-validation'
import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupForm() {

  const [validationErrors, setValidationErrors] = useState<SignUpValidationErrors | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPasswordInput] = useState("");
  const [signupFailedError, setSignupFailedError] = useState<string | undefined>("");

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await emailSignup(username, email, password, confirmPassword);

    if (result) {
      if (!result.success) {

        // Server sided errors
        if (result.apiError) {
          setSignupFailedError(result.message);
          return;
        }

        // Client sided errors
        else if (result.validationErrors) {
          setValidationErrors({
            email: result.validationErrors.email,
            password: result.validationErrors.password,
          });
          setSignupFailedError(result.message);

          if (result.validationErrors.password) {
            setPasswordInput("");
            setConfirmPasswordInput("");
          }
        }
      }
      // Redirect if no issues
      router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={(e) => handleSignup(e)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <Link
          href="/"
          className="flex w-min justify-center gap-x-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <LuArrowLeft className="ml-auto h-6 w-6 text-gray-50" />
          Back
        </Link>
        <div className="justify-items-center">
          <h1 className="mb-3 font-bold text-2xl text-gray-900">
            Account Sign Up
          </h1>
          <div className="w-3/6 min-w-96 max-w-2/12">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                Username
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  aria-describedby='name-error'
                />
                <LuUserRound className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="name-error" aria-live="polite" aria-atomic="true">
                {validationErrors?.name &&
                  validationErrors.name.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  aria-describedby='email-error'
                />
                <LuAtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {validationErrors?.email &&
                  validationErrors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => { setPasswordInput(e.target.value) }}
                  aria-describedby='password-error'
                />
                <LuKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="password-error" aria-live="polite" aria-atomic="true">
                {validationErrors?.password &&
                  validationErrors.password.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPasswordInput(e.target.value) }}
                  minLength={8}
                  required
                  aria-describedby='confirm-password-error'
                />
                <LuKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="confirm-password-error" aria-live="polite" aria-atomic="true">
              {validationErrors?.confirmPassword &&
                validationErrors.confirmPassword.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>

          </div>
          <input type="hidden" name="redirectTo" />
          <Button className="mt-4 w-min gap-x-2 text-nowrap">
            Sign Up <LuArrowRight className="ml-auto h-6 w-6 text-gray-50" />
          </Button>

          <div id="form-submit-error" aria-live="polite" aria-atomic="true">
            {(validationErrors || signupFailedError) &&
              <p className="mt-2 text-sm text-red-500">
                {signupFailedError}
              </p>
            }
          </div>
        </div>
      </div>
    </form>
  );
}

//aria-disabled={isPending}