import type { PostgrestError } from "@supabase/supabase-js";

export class ServiceError extends Error {
  readonly code?: string;

  readonly details?: string;

  readonly hint?: string;

  constructor(
    message: string,
    options?: { code?: string; details?: string; hint?: string; cause?: unknown },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "ServiceError";
    this.code = options?.code;
    this.details = options?.details;
    this.hint = options?.hint;
  }
}

export function toServiceError(
  context: string,
  error: PostgrestError | Error | null,
): ServiceError {
  if (!error) {
    return new ServiceError(`${context}: unknown error`);
  }
  if ("code" in error && "details" in error) {
    const pg = error as PostgrestError;
    return new ServiceError(`${context}: ${pg.message}`, {
      code: pg.code,
      details: pg.details ?? undefined,
      hint: pg.hint ?? undefined,
    });
  }
  const err = error as Error;
  return new ServiceError(`${context}: ${err.message}`, { cause: err });
}
