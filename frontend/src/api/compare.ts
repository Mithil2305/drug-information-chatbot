import { apiFetch } from './client'
import type { ComparisonResult } from '../types/comparison'

export const compareDrugs = (drugIds: string[]) =>
  apiFetch<ComparisonResult>('/api/compare', {
    method: 'POST',
    body: JSON.stringify({ drugIds }),
  })
