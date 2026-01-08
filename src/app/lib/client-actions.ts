'use server'

import { z } from 'zod';
import { auth } from '@/../auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers"

const SignUpFormSchema = z.object({
  name: z.string(),
  email: z.email({
    pattern: z.regexes.unicodeEmail
  }),
  password: z.string()
    .min(8, "Must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})


// .regex(/[A-Z]/, "Must contain at least one uppercase letter")
// .regex(/[a-z]/, "Must contain at least one lowercase letter")
// .regex(/[0-9]/, "Must contain at least one number")
// .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

export type State = {
  validationErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  data?: {} | null;
  error?: {} | null;
}

export async function signup(prevState: State, formData: FormData) {

  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    return {
      validationErrors: validatedFields.error.flatten().fieldErrors,
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
      message: response.statusText || 'Login Failed'
    }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

const LoginFormSchema = z.object({
  email: z.email({
    pattern: z.regexes.unicodeEmail
  }),
  password: z.string().min(8, "Must be at least 8 characters")
});

export async function login(prevState: State | undefined, formData: FormData) {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!validatedFields.success) {
    return {
      validationErrors: validatedFields.error.flatten().fieldErrors,
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
