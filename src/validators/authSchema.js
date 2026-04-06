import z from "zod";

export const loginValidator = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long")
    .max(100, "Password should be at most 100 characters long"),
});

export const registerValidator = loginValidator.extend({
  name: z
    .string()
    .min(3, "Name should be at least 3 characters long")
    .max(50, "Name should be at most 50 characters long"),
});

export const roleSchema = z.enum(["viewer", "analyst", "admin"], {
  required_error: "role is required",
  invalid_type_error: "Invalid role",
});

export const statusSchema = z.enum(["active", "inactive"], {
  required_error: "status is required",
  invalid_type_error: "Invalid status",
});