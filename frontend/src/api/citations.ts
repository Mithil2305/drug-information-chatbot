import { apiFetch } from './client'
import type { Evidence } from '../types/evidence'

export const fetchCitations = (answerId: string) =>
  apiFetch<Evidence[]>(`/api/v1/citations/${answerId}`)
