'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

export const DATA_TAG = 'sheet-data';

export const SheetConfigSchema = z.object({
  sheetUrlOrId: z.string().min(1),
  sheetName: z.string().min(1)
});

export type SheetConfig = z.infer<typeof SheetConfigSchema>;

const COOKIE_NAME = 'sheet_config_v1';

export function getDefaultSheetConfig(): SheetConfig {
  return {
    sheetUrlOrId: process.env.DEFAULT_SHEET_URL ?? '',
    sheetName: process.env.DEFAULT_SHEET_NAME ?? 'Sheet1'
  };
}

export async function readSheetConfig(): Promise<SheetConfig> {
  const c = (await cookies()).get(COOKIE_NAME)?.value;
  if (!c) return getDefaultSheetConfig();
  try {
    const parsed = JSON.parse(c);
    return SheetConfigSchema.parse(parsed);
  } catch {
    return getDefaultSheetConfig();
  }
}

export async function writeSheetConfig(cfg: SheetConfig) {
  const parsed = SheetConfigSchema.parse(cfg);
  (await cookies()).set(COOKIE_NAME, JSON.stringify(parsed), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });
}
