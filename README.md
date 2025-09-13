# داشبورد فارسی تحلیل بودجه تیم‌ها (Next.js 14)

**RTL + فارسی + اتصال امن به Google Sheets**  
این اپ به‌صورت سروری داده‌ها را مستقیماً از Google Sheets می‌خواند و نمودار و جدول تعاملی برای تحلیل هزینه‌ها بر اساس **دستور پرداخت (ستون G)** و **تیم‌ها (سطر ۱ ستون‌های کار P..LM)** ارائه می‌دهد. تنظیمات منبع داده (آدرس/ID شیت و نام شیت) از صفحهٔ «تنظیمات» قابل تغییر است و با ذخیره‌سازی، کش‌ها پاک و داده‌ها مجدداً بارگذاری می‌شوند.

## ⭐ ویژگی‌ها
- رابط کاربری **کاملاً فارسی و راست‌به‌چپ**، بهینه‌شده برای نمایش اعداد فارسی و ارز (تومان/ریال).
- **Next.js 14** (App Router) + **TypeScript** + Tailwind + Recharts + zod.
- دریافت امن داده‌ها روی سرور از Google Sheets با **Service Account** (ترجیحی) یا API Key (برای شیت‌های عمومی).
- **فیلتر چندانتخابی** برای دستور پرداخت‌ها و تیم‌ها.
- نمودار میله‌ای تجمیعی «هزینهٔ تیم‌ها…» + جدول آینه‌ای با جمع سطر/ستون.
- **درل‌داون** کارها (سطر ۲ P..LM) برای تیم(های) انتخاب‌شده.
- **کسورات (L..N)** و **بدهی‌ها (O)** با امکان گنجاندن/حذف در مجموع‌ها.
- صفحهٔ **تنظیمات** برای تغییر شیت و **ریست کش/وضعیت**.
- نرخ‌محدودسازی ساده و مدیریت خطای دوستانه.
- تست واحد برای پارس و تجمیع.

## 🚀 اجرا
```bash
cp .env.example .env
# مقادیر سرویس‌اکانت یا API Key را پر کنید، شیت را با ایمیل سرویس‌اکانت Share=Viewer کنید

npm i
npm run dev
```

### متغیرها
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` و `GOOGLE_SERVICE_ACCOUNT_KEY` (PEM با \n یا Base64)
- `GOOGLE_API_KEY` (اختیاری، فقط اگر شیت عمومی است)
- `DEFAULT_SHEET_URL` و `DEFAULT_SHEET_NAME` برای منبع پیش‌فرض
- `DEFAULT_CURRENCY` = `toman` | `irr` و `CURRENCY_TOMAN_FACTOR` (پیش‌فرض 10)

## 📄 ساختار مهم
- `app/page.tsx` — داشبورد اصلی (فیلترها، نمودار، جداول، درل‌داون).
- `app/settings/page.tsx` + `app/api/settings/route.ts` — تغییر منبع شیت و ریست.
- `app/api/data/route.ts` — خواندن شیت → نرمال‌سازی → JSON.
- `lib/sheets.ts` — کلاینت Google Sheets (سرویس‌اکانت یا API Key).
- `lib/parse.ts` — پارس هدرها (سطرهای ۱ و ۲) و جفت‌کردن ردیف‌های فریلنسر.
- `lib/compute.ts` — توابع کمکی تجمیع.
- `components/*` — اجزای UI فارسی/RTL.

---

# Budget Analytics Dashboard (English)

This is a **Persian RTL** budget analytics app that fetches data **server-side** from **Google Sheets** and renders interactive charts/tables by **payment order (col G)** and **teams** (from row 1 across task columns **P..LM**). A **Settings** page lets you switch the sheet (URL/ID + name) and forces a full cache/state reset.

See `.env.example` for configuration and share the sheet **as Viewer** with your service account email.
