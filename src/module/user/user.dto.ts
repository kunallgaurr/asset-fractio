import z from "zod";
import { UserType } from "./entities/user-master.entity";

export const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
export const phoneRegex = /^\+\d{1,4}\d{7,15}$/;

// Signup schema
export const signupSchema = z.object({
  type: z.enum(UserType),
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),

  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must be at most 30 characters long' })
    .regex(usernameRegex, { message: 'Username can only contain letters, numbers, and underscores' }),

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
  uid: z.string().refine((val) => {
    return (
      z.string().email().safeParse(val).success ||  // Email
      usernameRegex.test(val) ||                    // Username
      phoneRegex.test(val)                          // Phone number with country code
    );
  }, {
    message: 'UID must be a valid email, username, or phone number with country code',
  }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
});

export type TSignin = z.infer<typeof signinSchema>;

export const fetchUserSchema = z.object({
  userId: z.number().int().positive(),
});

export type TFetchUser = z.infer<typeof fetchUserSchema>;

// Base schema for optional fields
export const updateUserSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
    .optional(),
  phoneNumber: z
    .string()
    .min(7)
    .max(15)
    .regex(/^[0-9+\-()\s]+$/, 'Invalid phone number format.')
    .optional(),
  image: z.string().url().optional(),
  type: z.enum(UserType).optional(), // replace with actual enum values
  password: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
  confirmNewPassword: z.string().min(6).optional()
})
  .superRefine((data, ctx) => {
    const { password, newPassword, confirmNewPassword } = data;

    if (password) {
      if (!newPassword || !confirmNewPassword) {
        ctx.addIssue({
          path: ['newPassword'],
          code: z.ZodIssueCode.custom,
          message: 'New password and confirm password are required when changing password.',
        });

        ctx.addIssue({
          path: ['confirmNewPassword'],
          code: z.ZodIssueCode.custom,
          message: 'New password and confirm password are required when changing password.',
        });
      }

      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        ctx.addIssue({
          path: ['confirmNewPassword'],
          code: z.ZodIssueCode.custom,
          message: 'New password and confirm password do not match.',
        });
      }
    }
  });

export type TUpdateUser = z.infer<typeof updateUserSchema>;



