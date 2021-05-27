// react custom hooks example
// auto dark theme (controlled from System Preferences)
//
// Custom Hooks in React: The Ultimate UI Abstraction Layer
// - Tanner Linsley | JSConf Hawaii 2020
// https://www.youtube.com/watch?v=J-g9ZJha8FE

import { useCallback, useEffect, useState } from "react"
import { DarkMode } from "../Types"

const matchDark = '(prefers-color-scheme: dark)'

function useDarkMode(): DarkMode {
  const [isDark, setIsDark] = useState<boolean>(
    () => window.matchMedia && window.matchMedia(matchDark).matches
  )

  // https://blog.uhy.ooo/entry/2021-02-23/usecallback-custom-hooks/
  const toggleDark = useCallback(() => {
    setIsDark(prevIsDark => !prevIsDark)
  }, [])

  useEffect(() => {
    // skip if run from unit test
    if (window.matchMedia === undefined) return

    const matcher = window.matchMedia(matchDark)

    const onChange = (m: MediaQueryListEvent) => setIsDark(m.matches)
    matcher.addEventListener("change", onChange)

    return () => {
      matcher.removeEventListener("change", onChange)
    }
  }, [setIsDark])

  return [isDark, toggleDark]
}

export default useDarkMode
