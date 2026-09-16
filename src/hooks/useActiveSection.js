import { useEffect, useState } from 'react'
import { isAtPageBottom, pickActiveHref } from '../lib/activeSection.js'

// Returns the href ("#id") of the section the reader is currently in, or null.
// `orderedHrefs` must be a stable array (define it at module scope).
export function useActiveSection(orderedHrefs, { rootMargin }) {
  const [activeHref, setActiveHref] = useState(null)

  useEffect(() => {
    const sections = orderedHrefs.map((href) => document.querySelector(href)).filter(Boolean)
    const visibleHrefs = new Set()

    function update() {
      setActiveHref(pickActiveHref(orderedHrefs, visibleHrefs, isAtPageBottom()))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`
          if (entry.isIntersecting) {
            visibleHrefs.add(href)
          } else {
            visibleHrefs.delete(href)
          }
        })
        update()
      },
      { rootMargin, threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    // Secondary, lightweight fallback only — re-checks the bottom-of-page
    // condition so the last item can still activate on tall viewports where
    // the observer's trigger band never reaches that section.
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [orderedHrefs, rootMargin])

  return activeHref
}
