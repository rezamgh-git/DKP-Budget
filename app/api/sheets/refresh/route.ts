import { revalidateTag } from 'next/cache';
import { DATA_TAG } from '@/lib/state';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anon';
  const rl = rateLimit(`refresh:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'بیش از حد درخواست ریفرش' }), { status: 429 });
  }
  revalidateTag(DATA_TAG);
  return new Response(JSON.stringify({ ok: true, revalidated: true }), { status: 200 });
}
