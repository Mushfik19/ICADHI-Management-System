import { useEffect, useState } from 'react'

function readRoute(fallback) {
  const hash = window.location.hash.replace('#/', '').trim()
  return hash || fallback
}

export function useHashRoute(fallback = 'auth') {
  const [currentRoute, setCurrentRoute] = useState(() => readRoute(fallback))

  useEffect(() => {
    const syncRoute = () => setCurrentRoute(readRoute(fallback))

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    syncRoute()

    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [fallback])

  const navigate = (nextRoute) => {
    const normalized = String(nextRoute || '').trim()
    if (!normalized) {
      return
    }

    const nextHash = `/${normalized}`
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash
    }
    setCurrentRoute(normalized)
  }

  return { currentRoute, navigate }
}
