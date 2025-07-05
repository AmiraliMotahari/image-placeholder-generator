"use server";

import { generateBlurDataFromFile } from "@/lib/image-placeholder";
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
      const images = data.imageFiles;

      const results = await Promise.all(
        images.map(async(image) => {
          return await generateBlurDataFromFile(image.file);
        })
      );

      console.log(results);
      
      return {
        message: "Placeholders generated successfully.",
        results,
      };
    }
  );
