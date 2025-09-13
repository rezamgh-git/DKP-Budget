import { NextRequest } from 'next/server';
import { SheetConfigSchema, writeSheetConfig, DATA_TAG, readSheetConfig } from '@/lib/state';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const parsed = SheetConfigSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ ok: false, error: 'ورودی نامعتبر' }), { status: 400 });
  }
  await writeSheetConfig(parsed.data);
  revalidateTag(DATA_TAG);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function GET() {
  const cfg = await readSheetConfig();
  return new Response(JSON.stringify({ ok: true, data: cfg }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
