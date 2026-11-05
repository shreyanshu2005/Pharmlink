import { Moon, Sun } from 'lucide-react'
import useTheme from '../hooks/useTheme'

const ThemeToggle = () => {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type='button'
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
