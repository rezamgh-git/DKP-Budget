import Link from 'next/link';

export function Header() {
  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="لوگو" className="h-8 w-auto" />
      </div>
      <nav className="flex items-center gap-3 text-sm">
        <Link className="btn hover:bg-slate-100" href="/">داشبورد</Link>
        <Link className="btn hover:bg-slate-100" href="/settings">تنظیمات</Link>
        <a className="btn hover:bg-slate-100" href="/manifest.json">PWA</a>
      </nav>
    </header>
  );
}
