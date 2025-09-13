import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'داشبورد هزینه تیم‌ها',
  description: 'تحلیل هزینه‌ها بر اساس تیم و دستور پرداخت — فارسی/RTL',
  viewport: { width: 'device-width', initialScale: 1 }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="fa">
      <body className="bg-slate-50 text-slate-900">
        <div className="container py-4">
          <Header/>
          <main className="my-6">{children}</main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
