import { useCallback, useEffect, useState } from 'react'

const SECTION_IDS = [
  'home',
  'about',
  'facilities',
  'pricing',
  'gallery',
  'book-slot',
  'contact',
]

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
  return true
}

export function useActiveSection(ids = SECTION_IDS, offset = 120) {
  const [activeId, setActiveId] = useState(ids[0])

  const updateActive = useCallback(() => {
    let current = ids[0]
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.getBoundingClientRect().top
      if (top - offset <= 0) current = id
    }
    setActiveId(current)
  }, [ids, offset])

  useEffect(() => {
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [updateActive])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ids.includes(hash)) {
      requestAnimationFrame(() => scrollToSection(hash))
    }
  }, [ids])

  return activeId
}

export { SECTION_IDS }
