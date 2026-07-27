import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/zip-codes/bulk/import — JSON rows only; the browser parses the CSV
 * (multipart cannot traverse `proxyJson`).
 *
 * Answers 200 even with row failures: per-row problems are data, not transport
 * failures. `dryRun: true` powers the import preview with no writes.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/zip-codes/bulk/import", { method: "POST", body });
}
