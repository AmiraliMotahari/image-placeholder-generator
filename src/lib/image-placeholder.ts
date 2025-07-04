import { getPlaiceholder } from "plaiceholder";

export async function generateBlurDataFromUrl(imageUrl: string) {
  const buffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));
  return base64;
}

export async function generateBlurDataFromFile(image: File) {
  const buffer = await image.arrayBuffer();
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));
  return base64;
}
