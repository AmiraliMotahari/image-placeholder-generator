import z from "zod";

export const imageFileSchema = z.object({
  blobUrl: z.string().min(1),
  file: z.instanceof(File),
});

export const createPlaceholderSchema = z.object({
  imageFiles: z.array(imageFileSchema),
});

export type CreatePlaceholderSchema = z.infer<typeof createPlaceholderSchema>;
