import { z } from 'zod';
import { AddressType, IndianState } from './address.entity';

// Enums from your entity
export const AddressTypeEnum = z.enum(AddressType);

export const IndianStateEnum = z.enum(IndianState);

export const createAddressSchema = z.object({
  addressType: AddressTypeEnum.optional().default(AddressType.CURRENT),
  isPrimary: z.boolean().optional().default(false),
  houseNumber: z.string().max(50).trim().optional().nullable(),
  buildingName: z.string().max(100).trim().optional().nullable(),
  streetName: z.string().max(200).trim().optional().nullable(),
  area: z.string().max(100).trim().optional().nullable(),
  landmark: z.string().max(200).trim().optional().nullable(),
  city: z.string().min(1).max(100).trim(),
  state: IndianStateEnum,
  pinCode: z.string().length(6, { message: 'PIN code must be exactly 6 digits' }).regex(/^\d+$/, 'PIN code must be numeric'),
  country: z.string().max(50).default('India'),
});

export type TAddAddress = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = z.object({
  id: z.number(),
  addressType: AddressTypeEnum.optional().default(AddressType.CURRENT),
  isPrimary: z.boolean().optional().default(false),
  houseNumber: z.string().max(50).trim().optional().nullable(),
  buildingName: z.string().max(100).trim().optional().nullable(),
  streetName: z.string().max(200).trim().optional().nullable(),
  area: z.string().max(100).trim().optional().nullable(),
  landmark: z.string().max(200).trim().optional().nullable(),
  city: z.string().min(1).max(100).trim().optional(),
  state: IndianStateEnum.optional(),
  pinCode: z
    .string()
    .length(6, { message: 'PIN code must be exactly 6 digits' })
    .regex(/^\d+$/, 'PIN code must be numeric')
    .optional(),
  country: z.string().max(50).default('India').optional(),
})

export type TUpdateAddress = z.infer<typeof updateAddressSchema>;

