'use client';

type Props = {
  invoices: string[];
  teams: string[];
  selectedInvoices: string[];
  setSelectedInvoices: (v: string[]) => void;
  selectedTeams: string[];
  setSelectedTeams: (v: string[]) => void;
  includeDeductions: boolean;
  setIncludeDeductions: (v: boolean) => void;
  includeReceivables: boolean;
  setIncludeReceivables: (v: boolean) => void;
  onRefresh: () => void;
};

export function Filters(p: Props) {
  const toggleSel = (arr: string[], v: string, setter: (v:string[]) => void) => {
    if (arr.includes(v)) setter(arr.filter(x => x !== v));
    else setter([...arr, v]);
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-1">دستورهای پرداخت</div>
          <div className="flex flex-wrap gap-2">
            {(p.invoices ?? []).map(inv => (
              <button key={inv}
                className={`badge ${p.selectedInvoices.includes(inv) ? 'bg-brand-100 text-brand-800' : ''}`}
                onClick={() => toggleSel(p.selectedInvoices, inv, p.setSelectedInvoices)}
              >{inv}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">تیم‌ها</div>
          <div className="flex flex-wrap gap-2">
            {(p.teams ?? []).map(t => (
              <button key={t}
                className={`badge ${p.selectedTeams.includes(t) ? 'bg-brand-100 text-brand-800' : ''}`}
                onClick={() => toggleSel(p.selectedTeams, t, p.setSelectedTeams)}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.includeDeductions} onChange={e=>p.setIncludeDeductions(e.target.checked)} />
          کسورات
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.includeReceivables} onChange={e=>p.setIncludeReceivables(e.target.checked)} />
          بدهی‌ها
        </label>
        <button className="btn-primary" onClick={p.onRefresh}>بروزرسانی</button>
        <button className="btn hover:bg-slate-100" onClick={()=>{p.setSelectedInvoices([]); p.setSelectedTeams([]);}}>پیش‌فرض</button>
      </div>
    </div>
  );
}
