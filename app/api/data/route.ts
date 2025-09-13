import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { readSheetConfig } from '@/lib/state';
import { fetchSheetValues } from '@/lib/sheets';
import { parseSheet } from '@/lib/parse';
import { DataRequestSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rl = rateLimit(`data:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'محدودیت نرخ درخواست' }), { status: 429 });
  }

  const search = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = DataRequestSchema.safeParse({
    includeDeductions: search.includeDeductions === 'true',
    includeReceivables: search.includeReceivables === 'true',
    sheetUrlOrId: search.sheetUrlOrId,
    sheetName: search.sheetName
  });
  if (!parsed.success) {
    return new Response(JSON.stringify({ ok: false, error: 'پارامترهای نامعتبر' }), { status: 400 });
  }
  const cfg = await readSheetConfig();
  const sheetUrlOrId = parsed.data.sheetUrlOrId || cfg.sheetUrlOrId;
  const sheetName = parsed.data.sheetName || cfg.sheetName;

  try {
    const { values, lastUpdated } = await fetchSheetValues(sheetUrlOrId, sheetName);
    const ag = parseSheet(values, lastUpdated, !!parsed.data.includeDeductions, !!parsed.data.includeReceivables);
    return new Response(JSON.stringify({ ok: true, data: ag }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? 'خطا در دریافت داده' }), { status: 500 });
  }
}
