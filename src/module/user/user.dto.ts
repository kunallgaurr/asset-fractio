import z from "zod";
import { UserType } from "./entities/user-master.entity";

// Signup schema
export const signupSchema = z.object({
  type: z.enum(UserType),
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),

  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must be at most 30 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),

  email: z.string()
    .email({ message: 'Invalid email address' }),

  countryCode: z.string()
    .regex(/^\+\d{1,4}$/, { message: 'Country code must be in format like +1 or +91' }),

  phoneNumber: z.string()
    .min(7, { message: 'Phone number must be at least 7 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
});


export type TSignup = z.infer<typeof signupSchema>

export const signinSchema = z.object({
    uid: z.string(),
    password: z.string(),
});

export type TSignin = z.infer<typeof signinSchema>; 