'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [sheetUrlOrId, setSheetUrlOrId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // NEW: prefill from server cookie
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json().catch(()=>null);
      if (data?.ok && data.data) {
        setSheetUrlOrId(data.data.sheetUrlOrId || '');
        setSheetName(data.data.sheetName || 'Sheet1');
      }
    })();
  }, []);

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
    if (!data.ok) setMessage(data.error || 'خطا در ذخیره تنظیمات');
    else {
      setMessage('تنظیمات ذخیره شد. داده‌ها ریفرش شدند.');
      await fetch('/api/sheets/refresh', { method: 'POST' });
    }
  };

  // ... بقیه فایل بدون تغییر
}
