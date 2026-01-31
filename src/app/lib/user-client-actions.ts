'use client'

import { authClient } from '@/app/lib/auth-client'
import { SignUpFormSchema, LoginFormSchema, LoginValidationErrors, SignUpValidationErrors } from './utils/user-form-validation'
import { z } from 'zod';

type SignUpResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: SignUpValidationErrors; apiError: string | undefined }

export async function emailSignup(username: string, email:string, password: string, confirmPassword: string): Promise<SignUpResult> {

  const validatedFields = SignUpFormSchema.safeParse({
    name: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      validationErrors: flattenedErrors.fieldErrors,
      message: 'Missing or incomplete fields, sign up failed.',
      apiError: undefined
    }
  }
  
  const { data, error } = await authClient.signUp.email({
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    callbackURL: "/dashboard"
  }, {
    onRequest: (ctx) => {
      //show loading
    },
    onSuccess: (ctx) => {
      //redirect to the dashboard or sign in page
    },
    onError: (ctx) => {
      // display the error message
      console.log(ctx.error.message);
    },
  });
  
  if(error) {
    return { success: false, message: undefined, apiError: error.message }
  }
  
  return { success: true };
}

type LoginResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: LoginValidationErrors; apiError: string | undefined }

export async function emailLogin(inputEmail: string, inputPassword: string): Promise<LoginResult> {

  const validatedFields = LoginFormSchema.safeParse({
    email: inputEmail,
    password: inputPassword
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      validationErrors: flattenedErrors.fieldErrors,
      message: 'Missing or incomplete fields, login failed.',
      apiError: undefined
    }
  }

  const { data, error } = await authClient.signIn.email({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    callbackURL: "/dashboard"
  },{
    onRequest: (ctx) => {
      //show loading
    },
    onSuccess: (ctx) => {
      //redirect to the dashboard or sign in page
    },
    onError: (ctx) => {
      // display the error message
    },
  });

  if(error) {
    return { success: false, message: undefined, apiError: error.message }
  }
  
  return { success: true };
}

export async function googleLogin() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard"
  });
}

export async function logout() {
  
  try {
    await authClient.signOut();
    window.location.href = "/";
  } catch (e) {
    throw new Error("Logout Failure" + e);
  }
}

// export async function testDatabaseConnection() {
//   let isConnected = false;
//   try {
//     const mongoClient = await client.connect();
//     // Send a ping to confirm a successful connection
//     await mongoClient.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     ); // because this is a server action, the console.log will be outputted to your terminal not in the browser
//     return !isConnected;
//   } catch (e) {
//     console.error(e);
//     return isConnected;
//   }
// }
