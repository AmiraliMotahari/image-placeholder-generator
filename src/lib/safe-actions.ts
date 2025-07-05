import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e) {
    if (process.env.NODE_ENV === "development") {
      return e.message;
    }

    return "Something went wrong!";
  },
});
