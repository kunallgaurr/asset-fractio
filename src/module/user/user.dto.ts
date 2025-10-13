import z from "zod";
import { UserType } from "./user-master.entity";

export const signupSchema = z.object({
    type: z.enum(UserType),
    name: z.string(),
    username: z.string(),
    email: z.string(),
    countryCode: z.string(),
    phoneNumber: z.string(),
    password: z.string(),   
});

export type TSignup = z.infer<typeof signupSchema>

export const signinSchema = z.object({
    uid: z.string(),
    password: z.string(),
});

export type TSignin = z.infer<typeof signinSchema>; 