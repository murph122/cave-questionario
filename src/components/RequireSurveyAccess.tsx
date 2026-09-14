import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isSurveyUnlocked } from '../lib/access'

type Props = { children: ReactNode }

/** Blocks survey routes unless booking ID is approved. */
export function RequireSurveyAccess({ children }: Props) {
  const location = useLocation()
  if (!isSurveyUnlocked()) {
    return <Navigate to="/accedi" replace state={{ from: location.pathname }} />
  }
  return children
}
