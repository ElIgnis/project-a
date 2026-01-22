'use client';

import { LuAtSign, LuKey, LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { Button } from '@/app/ui/button';
import { login } from '@/app/lib/user-client-actions'
import { useState, useEffect, useActionState } from 'react';
import { LoginValidationErrors } from '@/../lib/utils/user-form-validation'
import Link from 'next/link'

export default function LoginForm() {

  const [validationErrors, setValidationErrors] = useState<LoginValidationErrors | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginFailedError, setLoginFailedError] = useState<string | undefined>("");

  const [result, loginFormAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (result && !result.success) {

      // Server sided errors
      if (result.apiError) {
        setLoginFailedError(result.apiError);
      }

      // Client sided errors
      else if (result.validationErrors) {
        setValidationErrors({
          email: result.validationErrors.email,
          password: result.validationErrors.password,
        });
        setLoginFailedError(result.message);
        if (result.validationErrors.password)
          setPasswordInput("");
      }
    }
  }, [result])

  return (
    <form action={loginFormAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <Link
          href="/"
          className="flex w-min justify-center gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <LuArrowLeft className="mt-0.5 ml-auto h-5 w-5 text-gray-50" />
          Back
        </Link>

        <div className="justify-items-center">
          <h1 className="mb-3 text-2xl text-gray-900">
            Log into your account
          </h1>

          <div className="w-3/6 min-w-96 max-w-2/12">
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
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); }}
                  required
                  minLength={6}
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
          </div>
          {/* <input type="hidden" name="redirectTo" /> */}
          <Button className="mt-4 w-min gap-4">
            Login <LuArrowRight className="ml-auto h-5 w-5 text-gray-50" />
          </Button>

          <div id="form-submit-error" aria-live="polite" aria-atomic="true">
            {(validationErrors || loginFailedError) &&
              <p className="mt-2 text-sm text-red-500">
                {loginFailedError}
              </p>
            }
          </div>
        </div>
      </div>
    </form>
  );
}

//aria-disabled={isPending}