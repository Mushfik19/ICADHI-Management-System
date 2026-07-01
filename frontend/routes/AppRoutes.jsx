import { useEffect, useState } from 'react'
import Dashboard from '../pages/dashboard/Dashboard'
import XrayAI from '../pages/ai-health/XrayAI'

function getRoute(pathname = window.location.pathname) {
  if (pathname.startsWith('/ai') || pathname.startsWith('/ai-health')) {
    return 'ai'
  }

  return 'dashboard'
}

export function AppRoutes() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute())
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return route === 'ai' ? <XrayAI /> : <Dashboard />
}