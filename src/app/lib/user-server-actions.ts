'use server'

import { auth } from '@/app/lib/auth'
import { z } from 'zod';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers"
import { SignUpFormSchema, LoginFormSchema, SignUpValidationErrors, LoginValidationErrors } from './utils/user-form-validation'

type SignUpResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: SignUpValidationErrors; apiError: string | undefined }

export async function signup(prevState: any, formData: FormData): Promise<SignUpResult> {

  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
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

  const response = await auth.api.signUpEmail({
    body: {
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    callbackURL: "/dashboard"
    }
    ,asResponse: true
  });

  if(!response.ok) {
    return { success: false, message: undefined, apiError: response.text.toString() }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

type LoginResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: LoginValidationErrors; apiError: string | undefined }

export async function login(prevState: any, formData: FormData) : Promise<LoginResult> {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
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

  const response = await auth.api.signInEmail({
    body: {
      email: validatedFields.data.email,
      password: validatedFields.data.password
    },
    asResponse: true
  });

  if(!response.ok) {
    return { success: false, message: undefined, apiError: response.text.toString() }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function logout() {
  try {
    await auth.api.signOut({
      headers: await headers()
    });

    redirect('/login');
  } catch(e) {
    console.error('Logout error' + e);
    return { error: 'Failed to logout'};
  }
}