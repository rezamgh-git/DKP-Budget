'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from 'react';
import { toCurrency } from '@/lib/format';

export function TeamCostChart({ aggregates, invoices }: { aggregates: any, invoices: string[] }) {
  const data = useMemo(() => {
    const map: Record<string, any> = {};
    for (const inv of invoices) {
      const teamMap = aggregates.byInvoiceTeam?.[inv] || {};
      for (const [team, val] of Object.entries(teamMap)) {
        map[team] = map[team] || { team, total: 0 };
        map[team][inv] = (map[team][inv] ?? 0) + (val as number);
        map[team].total += (val as number);
      }
    }
    return Object.values(map).sort((a,b)=>b.total - a.total);
  }, [aggregates, invoices]);

  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const handleLegendClick = (o: any) => {
    const { value } = o;
    setHidden(h => ({ ...h, [value]: !h[value] }));
  };

  const bars = invoices.map((inv) => hidden[inv] ? null : (
    <Bar key={inv} dataKey={inv} stackId="a" />
  ));

  return (
    <div className="w-full" style={{height: 360}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <XAxis dataKey="team" tickMargin={8} />
          <YAxis tickFormatter={(v)=>String(v)} />
          <Tooltip formatter={(v:any)=>toCurrency(Number(v))} />
          <Legend onClick={handleLegendClick} wrapperStyle={{ direction: 'ltr' }} />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
