// app/actions/sendMessage.ts
import { headers } from "next/headers";

export const getClientIp = async () => {
  const header = await headers();
  const xff = header.get("x-forwarded-for") ?? "";
  const xRealIp = header.get("x-real-ip") ?? "";

  return xff.split(",")[0].trim() || xRealIp || "unknown";
};
