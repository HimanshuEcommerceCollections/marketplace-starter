import type { z, ZodType } from "zod";

export type FieldErrors = Record<string, string[]>;

export interface ValidateResult<T> {
  success: boolean;
  data?: T;
  errors?: FieldErrors;
}

/** Thin wrapper over zod safeParse returning flattened field errors. */
export function validateForm<S extends ZodType>(
  schema: S,
  input: unknown,
): ValidateResult<z.infer<S>> {
  const result = schema.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: result.error.flatten().fieldErrors as FieldErrors,
  };
}
