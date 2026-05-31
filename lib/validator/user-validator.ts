import { z } from "zod";
import { type Result, success as successFunc, fail } from "@repo/types";
const zodValidateInput = z.object({
  user: z
    .string("User is not defined")
    .min(5, "User must be at least 5 caracters")
    .max(12),
  password: z
    .string("Password is not defined")
    .min(8, "Password must be at least 8 caracters")
    .max(20)
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Your password must contain at least one special caracter",
    ),
});
export type UserCreationInput = {
  user: string;
  password: string;
};
export function validate_user_input(
  param: unknown | UserCreationInput,
): Result<UserCreationInput, Partial<UserCreationInput>> {
  const { success, data, error: zodError } = zodValidateInput.safeParse(param);
  if (success) {
    return successFunc(data);
  }
  const formatError = z.flattenError(zodError).fieldErrors;
  const error = Object.fromEntries(
    Object.entries(formatError).map(([key, val]) => [key, val[0]]),
  );
  return fail(error);
}
