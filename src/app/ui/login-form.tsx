'use client';

import { LuAtSign, LuKey, LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { Button } from '@/app/ui/button';
import { emailLogin, googleLogin } from '@/app/lib/user-client-actions'
import { useState } from 'react';
import { LoginValidationErrors } from '@/app/lib/utils/user-form-validation'
import Link from 'next/link'

export default function LoginForm() {

  const [validationErrors, setValidationErrors] = useState<LoginValidationErrors | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginFailedError, setLoginFailedError] = useState<string | undefined>("");

  const handleLogin = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await emailLogin(email, password);

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
          setPassword("");
      }
    }
  }

  const handleGoogleLogin = async() => {
    await googleLogin();
  }

  return (
    <div className="flex flex-col h-dvh">
      <div className="flex flex-1 flex-col bg-gray-50 h-fit items-center justify-center pt-8 pb-8 gap-y-16">

        {/* Login form */}
        <form onSubmit={handleLogin} >
          <div className="justify-items-center">
              <h1 className="mb-3 font-bold text-2xl text-gray-900">
                Log into your account
              </h1>
              <div id="form-submit-error" aria-live="polite" aria-atomic="true">
                {(validationErrors || loginFailedError) &&
                  <p className="mt-2 text-sm text-red-500">
                    {loginFailedError}
                  </p>
                }
              </div>

              {/* Normal login */}
              <div className="w-3/6 min-w-96 max-w-2/12 pb-8 border-gray-800 border-b-2">
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      aria-describedby='email-error'
                    />
                    <LuAtSign className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                      className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); }}
                      required
                      minLength={6}
                      aria-describedby='password-error'
                    />
                    <LuKey className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

                <div className="justify-items-center">
                  <Button className="mt-4 w-min gap-x-2" type="submit">
                    Login <LuArrowRight className="ml-auto h-5 w-5 text-gray-50" />
                  </Button>
                </div>
              </div>

              {/* SSO */}
              <div className="flex flex-col items-center mt-8 gap-y-4">
                <h2 className="font-bold text-lg text-gray-800">Social Sign On</h2>
                  <Button 
                  className="w-min gap-x-2 bg-neutral-50 border-2 border-gray-800 p-8" 
                  type="button"
                  onClick={()=>handleGoogleLogin()}
                  >
                    <p className=" text-nowrap text-gray-800">Google Login</p>
                    <FcGoogle className="ml-auto h-10 w-10" />
                  </Button>
              </div>


            </div>
        </form>
        {/* Sign up */}
        <div className="flex-row">
          <p className="text-gray-900">
            Don't have an account yet?
            <Link
                href="/signup"
                className="justify-center text-green-600 px-1 py-3 text-sm font-medium transition-color md:text-base"
            >
                <span>Sign Up</span>
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}

//aria-disabled={isPending}