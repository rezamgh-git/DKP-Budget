import { describe, it, expect } from 'vitest';
import { totalsByTeamAcrossInvoices, tasksByTeamAcrossInvoices } from '@/lib/compute';

describe('compute helpers', ()=>{
  const ag: any = {
    byInvoiceTeam: {
      A: { 'تیم 1': 100, 'تیم 2': 50 },
      B: { 'تیم 1': 30 }
    },
    byInvoiceTeamTask: {
      A: { 'تیم 1': { 'تسک X': 100 } },
      B: { 'تیم 1': { 'تسک X': 30 }, 'تیم 2': { 'تسک Y': 20 } }
    }
  };

  it('totals by team', ()=>{
    const t = totalsByTeamAcrossInvoices(ag, ['A','B']);
    expect(t['تیم 1']).toBe(130);
    expect(t['تیم 2']).toBe(50);
  });

  it('tasks filtered by team', ()=>{
    const t = tasksByTeamAcrossInvoices(ag, ['A','B'], ['تیم 1']);
    expect(t['تسک X']).toBe(130);
    expect(t['تسک Y']).toBeUndefined();
  });
});
