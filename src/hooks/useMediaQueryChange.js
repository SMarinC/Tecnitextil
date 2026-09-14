import { useEffect, useRef } from 'react'

// Calls onChange(matches) whenever the media query starts or stops matching.
export function useMediaQueryChange(query, onChange) {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const listener = (event) => onChangeRef.current(event.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [query])
}
