export function isValidPdf(file: File): boolean {
  return file.type === 'application/pdf'
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
