"use server";

import { formattedResetTimestamp } from "@/lib/formatter";
import { generateBlurDataFromFile } from "@/lib/image-placeholder";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/redis";
import { actionClient } from "@/lib/safe-actions";
import {
  CreatePlaceholderSchema,
  createPlaceholderSchema,
} from "@/lib/zod-schemas/generate-placeholder";
import { flattenValidationErrors } from "next-safe-action";

export const generatePlaceholderAction = actionClient
  .metadata({ actionName: "generatePlaceholderAction" })
  .inputSchema(createPlaceholderSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: data }: { parsedInput: CreatePlaceholderSchema }) => {
      const ip = await getClientIp();

      // 1) Check the rate-limit
      const { success, reset } = await rateLimit.limit(ip);

      if (!success) {
        // 2) If over limit, throw a controlled error
        throw new Error(
          `Rate limit exceeded. Try again in ${formattedResetTimestamp(reset)}.`
        );
      }

      const images = data.imageFiles;

      const results = await Promise.all(
        images.map(async (image) => {
          return await generateBlurDataFromFile(image.file);
        })
      );

      return {
        message: "Placeholders generated successfully.",
        results,
      };
    }
  );
