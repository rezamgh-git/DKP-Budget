import { z } from 'zod';

export const DataRequestSchema = z.object({
  includeDeductions: z.boolean().optional(),
  includeReceivables: z.boolean().optional(),
  sheetUrlOrId: z.string().min(1).optional(),
  sheetName: z.string().min(1).optional(),
});

export type DataRequest = z.infer<typeof DataRequestSchema>;
