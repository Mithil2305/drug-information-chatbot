export interface ComparisonResult {
  drugs: DrugComparison[]
}

export interface DrugComparison {
  id: string
  name: string
  attributes: Record<string, string>
  evidenceIds: string[]
}
