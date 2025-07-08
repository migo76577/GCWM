import { z } from 'zod';

export const driverSchema = z.object({
  // User fields
  name: z
    .string()
    .min(1, 'Full name is required')
    .max(255, 'Full name must be less than 255 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be a valid email address'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must be less than 255 characters'),
  
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
  
  // Driver fields
  employee_number: z
    .string()
    .min(1, 'Employee number is required')
    .max(50, 'Employee number must be less than 50 characters'),
  
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Phone number must be a valid international format'),
  
  license_number: z
    .string()
    .min(1, 'License number is required')
    .max(50, 'License number must be less than 50 characters'),
  
  license_expiry: z
    .string()
    .min(1, 'License expiry date is required')
    .refine((val) => {
      const expiryDate = new Date(val);
      const today = new Date();
      return expiryDate > today;
    }, 'License expiry date must be in the future'),
  
  hire_date: z
    .string()
    .min(1, 'Hire date is required')
    .refine((val) => {
      const hireDate = new Date(val);
      const today = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(today.getFullYear() - 100);
      return hireDate >= hundredYearsAgo && hireDate <= today;
    }, 'Hire date must be realistic and not in the future'),
  
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters'),
  
  status: z
    .enum(['active', 'inactive', 'suspended'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be active, inactive, or suspended',
    }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const driverUpdateSchema = z.object({
  // Driver fields only (no user fields for updates)
  employee_number: z
    .string()
    .min(1, 'Employee number is required')
    .max(50, 'Employee number must be less than 50 characters')
    .optional(),
  
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Phone number must be a valid international format'),
  
  license_number: z
    .string()
    .min(1, 'License number is required')
    .max(50, 'License number must be less than 50 characters'),
  
  license_expiry: z
    .string()
    .min(1, 'License expiry date is required')
    .refine((val) => {
      const expiryDate = new Date(val);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return expiryDate >= today;
    }, 'License expiry date must not be in the past'),
  
  hire_date: z
    .string()
    .min(1, 'Hire date is required')
    .refine((val) => {
      const hireDate = new Date(val);
      const today = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(today.getFullYear() - 100);
      return hireDate >= hundredYearsAgo && hireDate <= today;
    }, 'Hire date must be realistic and not in the future'),
  
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters'),
  
  status: z
    .enum(['active', 'inactive', 'suspended'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be active, inactive, or suspended',
    }),
});