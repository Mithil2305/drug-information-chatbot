import { apiFetch } from './client'
import type { ComparisonResult } from '../types/comparison'

export const compareDrugsApi = (drug1Id: string, drug2Id: string) =>
  apiFetch<ComparisonResult>('/api/v1/compare', {
    method: 'POST',
    body: JSON.stringify({ drug1Id, drug2Id }),
  })

export const compareDrugs = compareDrugsApi
