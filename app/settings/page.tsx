'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [sheetUrlOrId, setSheetUrlOrId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sheetUrlOrId, sheetName })
    });
    const data = await res.json();
    setSaving(false);
    if (!data.ok) {
      setMessage(data.error || 'خطا در ذخیره تنظیمات');
    } else {
      setMessage('تنظیمات ذخیره شد. داده‌ها ریفرش شدند.');
      await fetch('/api/sheets/refresh', { method: 'POST' });
    }
  };

  return (
    <div className="card p-4">
      <h1 className="text-lg font-bold mb-4">تنظیمات</h1>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">آدرس یا شناسه گوگل شیت</label>
          <input className="w-full border rounded-lg px-3 py-2" dir="ltr" placeholder="Sheet URL or ID"
            value={sheetUrlOrId} onChange={e=>setSheetUrlOrId(e.target.value)} />
          <p className="text-xs text-slate-600 mt-1">شیت را با ایمیل سرویس‌اکانت به صورت «Viewer» به اشتراک بگذارید.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">نام شیت</label>
          <input className="w-full border rounded-lg px-3 py-2" dir="ltr" placeholder="Sheet1"
            value={sheetName} onChange={e=>setSheetName(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <button disabled={saving} onClick={onSave} className="btn-primary">
            {saving ? 'در حال ذخیره…' : 'ذخیره و ریفرش'}
          </button>
          {message && <span className="text-sm">{message}</span>}
        </div>
      </div>
      <hr className="my-6"/>
      <div className="text-sm text-slate-700 space-y-1">
        <p>ایمیل سرویس‌اکانت: <code dir="ltr">{process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? 'your-sa@project.iam.gserviceaccount.com'}</code></p>
        <p>پس از ذخیره، کش سرور پاک و داده‌ها دوباره‌خوانی می‌شوند.</p>
      </div>
    </div>
  );
}
