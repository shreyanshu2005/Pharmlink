import { useCallback, useEffect, useState } from 'react'

const KEY = 'theme'

const readInitial = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Keeps <html class="dark"> in sync and remembers the choice across visits.
export default function useTheme() {
  const [theme, setTheme] = useState(readInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem(KEY, theme) } catch { /* ignore */ }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}
