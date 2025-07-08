import { z } from 'zod';

const baseCustomerSchema = z.object({
  customer_number: z.string()
    .max(255, 'Customer number must not exceed 255 characters')
    .optional()
    .or(z.literal('')),
  
  name: z.string()
    .min(1, 'Full name is required')
    .max(255, 'Name must not exceed 255 characters')
    .optional(),
    
  category_id: z.string()
    .min(1, 'Customer category is required')
    .or(z.number().positive('Customer category is required')),
    
  route_id: z.string()
    .min(1, 'Route selection is required')
    .or(z.number().positive('Route selection is required')),
  
  first_name: z.string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters'),
  
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters'),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[0-9\s\-()]{10,}$/, 'Please enter a valid phone number'),
  
  alternative_phone: z.string()
    .regex(/^[+]?[0-9\s\-()]{10,}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
  
  city: z.string()
    .min(1, 'City is required')
    .max(255, 'City must not exceed 255 characters'),
  
  area: z.string()
    .min(1, 'Area/neighborhood is required')
    .max(255, 'Area must not exceed 255 characters'),
  
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .or(z.string().regex(/^-?([0-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/, 'Invalid latitude format')),
  
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .or(z.string().regex(/^-?((1[0-7][0-9])|([0-9]?[0-9]))(\.[0-9]+)?$|^-?180(\.0+)?$/, 'Invalid longitude format')),
  
  registration_fee: z.number()
    .min(0, 'Registration fee must be a positive number')
    .optional()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid fee format').optional()),
  
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

// Schema for creating a customer (excludes auto-generated fields)
export const createCustomerSchema = baseCustomerSchema.omit({
  registration_fee: true, // This might be set by admin separately
});

// Schema for updating a customer
export const updateCustomerSchema = baseCustomerSchema.partial();

// Export the base schema for other uses
export const customerSchema = baseCustomerSchema;