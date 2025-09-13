'use client';

import useSWR from 'swr';
import { Filters } from '@/components/Filters';
import { TeamCostChart } from '@/components/TeamCostChart';
import { TeamCostTable } from '@/components/TeamCostTable';
import { TaskBreakdown } from '@/components/TaskBreakdown';
import { ErrorState } from '@/components/ErrorState';
import { Skeletons } from '@/components/Skeletons';
import { useMemo, useState } from 'react';
import { toPersianDigits } from '@/lib/format';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Page() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [includeDeductions, setIncludeDeductions] = useState(false);
  const [includeReceivables, setIncludeReceivables] = useState(false);

  const params = new URLSearchParams();
  if (includeDeductions) params.set('includeDeductions', 'true');
  if (includeReceivables) params.set('includeReceivables', 'true');

  const { data, error, isLoading, mutate } = useSWR(`/api/data?${params.toString()}`, fetcher, { refreshInterval: 60_000 });

  const invoices = useMemo(() => data?.data?.invoices ?? [], [data]);
  const teams = useMemo(() => data?.data?.teams ?? [], [data]);

  const lastUpdated = data?.data?.lastUpdated ? new Date(data.data.lastUpdated) : null;

  if (error) {
    return <ErrorState message="بروز خطا در دریافت داده‌ها" detail={String(error)} onRetry={() => mutate()} />;
  }

  if (isLoading || !data) {
    return <Skeletons/>;
  }

  const aggregates = data.data;
  const effectiveInvoices = selectedInvoices.length ? selectedInvoices : invoices;
  const effectiveTeams = selectedTeams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">داشبورد هزینه‌ها</h1>
        <div className="text-sm text-slate-600">
          {lastUpdated ? <>آخرین بروزرسانی: {toPersianDigits(lastUpdated.toLocaleString('fa-IR'))}</> : null}
        </div>
      </div>

      <Filters
        invoices={invoices}
        teams={teams}
        selectedInvoices={selectedInvoices}
        setSelectedInvoices={setSelectedInvoices}
        selectedTeams={selectedTeams}
        setSelectedTeams={setSelectedTeams}
        includeDeductions={includeDeductions}
        setIncludeDeductions={setIncludeDeductions}
        includeReceivables={includeReceivables}
        setIncludeReceivables={setIncludeReceivables}
        onRefresh={async () => {
          await fetch('/api/sheets/refresh', { method: 'POST' });
          await mutate();
        }}
      />

      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-4">هزینهٔ تیم‌ها در دستورهای پرداخت انتخاب‌شده</h2>
        <TeamCostChart aggregates={aggregates} invoices={effectiveInvoices} />
        <div className="mt-6">
          <TeamCostTable aggregates={aggregates} invoices={effectiveInvoices} />
        </div>
      </section>

      {effectiveTeams.length > 0 && (
        <section className="card p-4">
          <h2 className="text-lg font-semibold mb-4">جزئیات کارها برای تیم(های) انتخاب‌شده</h2>
          <TaskBreakdown aggregates={aggregates} invoices={effectiveInvoices} teams={effectiveTeams} />
        </section>
      )}
    </div>
  );
}
