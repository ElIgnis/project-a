import { z } from "zod";

export interface SignUpErrors {
    name?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
    confirmPassword?: string[] | undefined;
    content?: string[] | undefined;
}

export const SignUpFormSchema = z
    .object({
        name: z.string(),
        email: z.email({
            pattern: z.regexes.email,
        }),
        password: z.string().min(8, "Must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
// .regex(/[A-Z]/, "Must contain at least one uppercase letter")
// .regex(/[a-z]/, "Must contain at least one lowercase letter")
// .regex(/[0-9]/, "Must contain at least one number")
// .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

export interface LoginErrors {
    email?: string[] | undefined;
    password?: string[] | undefined;
    content?: string[] | undefined;
}

export const LoginFormSchema = z.object({
    email: z.email({
        pattern: z.regexes.email,
    }),
    password: z.string().min(8, "Must be at least 8 characters"),
});
