import { useEffect, useEffectEvent } from 'react'

// Calls onChange(matches) whenever the media query starts or stops matching.
// useEffectEvent always sees the latest onChange without re-subscribing.
export function useMediaQueryChange(query, onChange) {
  const handleChange = useEffectEvent((event) => onChange(event.matches))

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])
}
