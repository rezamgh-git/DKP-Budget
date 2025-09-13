import { describe, it, expect } from 'vitest';
import { parseSheet } from '@/lib/parse';

describe('parseSheet basics', () => {
  it('detects headers and aggregates', () => {
    const values = [
      Array(18).fill('').map((_,i)=> i===15 ? 'تیم A' : i===16 ? 'تیم B' : ''),
      Array(18).fill('').map((_,i)=> i===15 ? 'تسک 1' : i===16 ? 'تسک 2' : ''),
      makeRow({ G:'INV-1', H:'علی', J:0, L:0, M:0, N:0, O:0, P:100, Q:50 }),
      makeRow({ G:'INV-1', H:'علی', J:120, L:5, M:0, N:0, O:0, P:0, Q:0 }),
      makeRow({ G:'INV-2', H:'مینا', J:0, P:40, Q:60 }),
      makeRow({ G:'INV-2', H:'مینا', J:90 })
    ];
    const ag = parseSheet(values as any, '2025-01-01T00:00:00Z', false, false);
    expect(ag.invoices.sort()).toEqual(['INV-1','INV-2'].sort());
    expect(ag.byInvoiceTeam['INV-1']['تیم A']).toBe(100);
    expect(ag.byInvoiceTeam['INV-1']['تیم B']).toBe(50);
    expect(ag.payoutsByInvoice['INV-1']).toBe(120);
  });
});

function makeRow({G='',H='',J=0,L=0,M=0,N=0,O=0,P=0,Q=0}:{[k:string]:any}) {
  const row = Array(18).fill('');
  row[6]=G; row[7]=H; row[9]=J; row[11]=L; row[12]=M; row[13]=N; row[14]=O; row[15]=P; row[16]=Q;
  return row;
}
