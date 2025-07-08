import { z } from 'zod';

export const vehicleSchema = z.object({
  vehicle_number: z
    .string()
    .min(1, 'Vehicle number is required')
    .max(50, 'Vehicle number must be less than 50 characters'),
  
  license_plate: z
    .string()
    .min(1, 'License plate is required')
    .max(20, 'License plate must be less than 20 characters')
    .regex(/^[A-Z0-9\-\s]+$/i, 'License plate can only contain letters, numbers, hyphens, and spaces'),
  
  make: z
    .string()
    .min(1, 'Make is required')
    .max(100, 'Make must be less than 100 characters'),
  
  model: z
    .string()
    .min(1, 'Model is required')
    .max(100, 'Model must be less than 100 characters'),
  
  year: z
    .string()
    .min(1, 'Year is required')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, 'Year must be between 1900 and next year'),
  
  vehicle_type: z
    .enum(['truck', 'van', 'pickup'], {
      required_error: 'Vehicle type is required',
      invalid_type_error: 'Vehicle type must be truck, van, or pickup',
    }),
  
  capacity_kg: z
    .string()
    .min(1, 'Capacity is required')
    .refine((val) => {
      const capacity = parseFloat(val);
      return !isNaN(capacity) && capacity > 0 && capacity <= 50000;
    }, 'Capacity must be a positive number up to 50,000 kg'),
  
  status: z
    .enum(['active', 'maintenance', 'inactive'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be active, maintenance, or inactive',
    }),
  
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});