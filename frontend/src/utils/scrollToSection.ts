const NAVBAR_OFFSET = 88

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  const element = document.getElementById(sectionId)
  if (!element) return false

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior })
  return true
}

export function parseSectionIdFromPath(path: string): string | null {
  if (!path.includes('#')) return null
  const hash = path.split('#')[1]
  return hash?.trim() || null
}

export function scrollToSectionWhenReady(sectionId: string) {
  // Execute a sequence of scrolls at increasing delays to account for dynamic layout shifts (images, components loading)
  const delays = [0, 50, 150, 300, 600, 1000, 1500]
  delays.forEach((delay) => {
    window.setTimeout(() => {
      scrollToSection(sectionId)
    }, delay)
  })
}
