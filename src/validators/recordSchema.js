import { z } from "zod";
import { CATEGORIES } from "../models/FinancialRecord.js";

export const createRecordValidator = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount must be positive"),

  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be income or expense" }),
  }),

  category: z.enum(CATEGORIES, {
    errorMap: () => ({
      message: `Category must be one of: ${CATEGORIES.join(", ")}`,
    }),
  }),

  date: z
    .string({ required_error: "Date is required" })
    .datetime({ message: "Invalid date format" })
    .refine(
      (val) => new Date(val) <= new Date(),
      "Date cannot be in the future",
    )
    .transform((val) => new Date(val)),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export const updateRecordValidator = createRecordValidator
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

  export const getRecordsQueryValidator = z.object({
  type: z.enum(['income', 'expense']).optional(),  

  category: z.enum(CATEGORIES).optional(),       

  startDate: z
    .string()
    .datetime({ message: 'Invalid startDate format' })
    .optional(),

  endDate: z
    .string()
    .datetime({ message: 'Invalid endDate format' })
    .optional(),

  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, 'Page must be greater than 0')
    .optional(),

  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional(),

  sortBy: z
    .enum(['date', 'amount', 'createdAt'])
    .optional(),

  order: z
    .enum(['asc', 'desc'])
    .optional()

}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  'startDate must be before endDate'
);
