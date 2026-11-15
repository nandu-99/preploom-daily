import type { DsaSheet } from "@/content/dsa";

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getDsaSheets(): Promise<DsaSheet[]> {
  try {
    const response = await fetch(`${backendUrl}/dsa/sheets`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: { sheets?: DsaSheet[] } };
    return Array.isArray(body.data?.sheets) ? body.data.sheets : [];
  } catch {
    return [];
  }
}
