import { z } from "zod";

export const AddAssetSchema = z.object({
    userId: z.number({
        message: "User ID is required",
    }),

    images: z
        .array(z.url("Each image must be a valid URL"))
        .min(3, "At least 3 images are required"),

    name: z.string().min(2, "Asset name must be at least 2 characters long"),

    builderName: z.string().min(2, "Builder name must be at least 2 characters long"),

    location: z.string().min(3, "Location is required"),

    area: z.string().min(1, "Area is required"),

    age: z.string().optional().default("0"),

    characteristics: z
        .array(z.string())
        .min(3, "At least 3 characteristics are required"),

    documents: z
        .array(z.object({
            name: z.string(),
            url: z.url()
        }))
        .min(3, "At least 3 documents are required"),
});

export type TAddAsset = z.infer<typeof AddAssetSchema>;
