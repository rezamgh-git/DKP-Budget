# اتصال امن به Google Sheets

1) یک **Service Account** بسازید و کلید خصوصی (PEM) را دریافت کنید.  
2) متغیرها را در `.env` پر کنید:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
   یا اگر Base64 دارید همان مقدار Base64 را در متغیر کلید قرار دهید—برنامه خودش تشخیص می‌دهد.

3) فایل Google Sheet خود را با **ایمیل سرویس‌اکانت** به صورت **Viewer** به اشتراک بگذارید.

4) مسیر پیش‌فرض را در `.env` تنظیم کنید:
```
DEFAULT_SHEET_URL=https://docs.google.com/spreadsheets/d/.../edit#gid=0
DEFAULT_SHEET_NAME=Sheet1
```

5) برای تغییر منبع داده در حین اجرا به صفحه **/settings** بروید، URL/ID و نام شیت را وارد و ذخیره کنید. با ذخیره، کش‌ها پاک و داده‌ها مجدداً خوانده می‌شود.
