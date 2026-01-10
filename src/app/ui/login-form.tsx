'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { login } from '@/app/lib/client-actions'
import { useState } from 'react';
import { LoginValidationErrors } from '@/../lib/utils/form-validation'

export default function LoginForm() {

  const [validationErrors, setValidationErrors] = useState<LoginValidationErrors | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginFailedError, setLoginFailedError] = useState<string | undefined>("");

  const handleLogin = async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const result = await login(formData);
      
      // Client sided errors
      if(result.validationErrors) {
        setValidationErrors({
          email: result.validationErrors.email,
          password: result.validationErrors.password,
          message: result.message});
        setLoginFailedError(result.message);
        if(result.validationErrors.password)
          setPasswordInput("");
      }

      // Server sided errors
      if(result.error) {
        setLoginFailedError(result.error.message);
      }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className= "mb-3 text-2xl text-gray-900">
          Log into your account
        </h1>
        <div className="w-1/6">
        
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
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                onChange={(e)=>{setPasswordInput(e.target.value);}}
                required
                minLength={6}
                aria-describedby='password-error'
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
        <input type="hidden" name="redirectTo" />
        <Button className="mt-4 w-1/6"> 
          Login <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        
        <div id="form-submit-error" aria-live="polite" aria-atomic="true">
          {(validationErrors || loginFailedError) &&
            <p className="mt-2 text-sm text-red-500">
                {loginFailedError}
              </p>
          }
        </div>
      </div>
    </form>
  );
}

//aria-disabled={isPending}