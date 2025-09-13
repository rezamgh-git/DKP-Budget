import { google } from 'googleapis';

/** Extract the Google Sheet ID from a full URL, or pass-through if already an ID. */
export function extractSheetId(sheetUrlOrId: string): string {
  const m = sheetUrlOrId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : sheetUrlOrId;
}

function decodeKey(raw: string) {
  try {
    const maybe = Buffer.from(raw, 'base64').toString('utf-8');
    if (maybe.includes('BEGIN PRIVATE KEY')) return maybe;
  } catch {}
  return raw.replace(/\\n/g, '\n');
}

function getServiceAccountAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!clientEmail || !privateKeyRaw) return null;
  const key = decodeKey(privateKeyRaw);
  return new google.auth.JWT({
    email: clientEmail,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
}

export async function fetchSheetValues(sheetUrlOrId: string, sheetName: string): Promise<{ values: any[][], lastUpdated: string }> {
  const sheetId = extractSheetId(sheetUrlOrId);
  const auth = getServiceAccountAuth();
  const sheets = google.sheets({ version: 'v4', auth: auth ?? undefined });

  if (auth) {
    const range = `${sheetName}`;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range
    });
    const values = (res.data.values ?? []) as any[][];
    const lastUpdated = new Date().toISOString();
    return { values, lastUpdated };
  } else if (process.env.GOOGLE_API_KEY) {
    const fetch = (await import('node-fetch')).default as any;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?key=${process.env.GOOGLE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch public sheet');
    const data = await res.json();
    const values = (data.values ?? []) as any[][];
    const lastUpdated = new Date().toISOString();
    return { values, lastUpdated };
  } else {
    throw new Error('No Google auth configured. Provide service account or API key.');
  }
}
