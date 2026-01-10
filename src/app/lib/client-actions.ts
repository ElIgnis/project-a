'use client'

import { authClient } from '@/../lib/auth-client'
import { SignUpFormSchema, LoginFormSchema } from '@/../lib/utils/form-validation'

export async function signup(formData: FormData) {

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
  
  return { data, error }
}

export async function login(formData: FormData) {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!validatedFields.success) {
    return {
      validationErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or incomplete fields, Login failed.',
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
  
  return { data, error };
}

export async function logout() {
  
  try {
    await authClient.signOut();
    window.location.href = "/login";
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
