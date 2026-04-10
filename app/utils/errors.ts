import z from "zod";

/**
 * Extracts the actual error message from the given API error if available.
 */
export function getErrorMessage(error?: unknown): string | undefined {
  if (typeof error === "string") return error;
  if (!(error instanceof Error)) return;
  console.log("Test", { error });

  // try to extract actual error message from the API response
  const messageSchema = z.object({
    data: z.object({
      message: z.string(),
    }),
  });

  const { data: apiData } = messageSchema.safeParse(error);
  if (apiData?.data.message) return apiData.data.message;

  return error.message;
}
