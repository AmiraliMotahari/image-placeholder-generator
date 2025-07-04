"use server";

import { generateBlurDataFromFile } from "@/lib/image-placeholder";
import { ImageFile } from "@/lib/types";

export const generatePlaceholderAction = async (images: ImageFile[]) => {
  try {
    const results = await Promise.all(
      images.map((image) => {
        return generateBlurDataFromFile(image.file);
      })
    );

    return results;
  } catch (error) {
    console.log(error);
  }
};
