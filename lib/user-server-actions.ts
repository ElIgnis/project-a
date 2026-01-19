'use server'

import { auth } from '@/../auth'
import { z } from 'zod';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers"
import { SignUpFields, SignUpFormSchema, LoginFields, LoginFormSchema } from './utils/user-form-validation'

export async function signup(signupFields: SignUpFields, formData: FormData) {

  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      validationErrors: flattenedErrors.fieldErrors,
      message: 'Missing Fields, Sign up failed.',
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
    return {
      validationErrors: {},
      message: response.statusText || 'Signup Failed'
    }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function login(loginFields: LoginFields | undefined, formData: FormData) {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      validationErrors: flattenedErrors.fieldErrors,
      message: 'Missing Fields, Login failed.',
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
    return {
      validationErrors: {},
      message: response.statusText || 'Login Failed'
    }
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