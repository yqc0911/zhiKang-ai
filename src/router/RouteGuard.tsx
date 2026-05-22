import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { beforeEach } from './permission'

interface RouteGuardProps {
  children: ReactNode
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const location = useLocation()
  const guardResult = beforeEach({ pathname: location.pathname })

  if (!guardResult.allow && guardResult.redirect) {
    return <Navigate to={guardResult.redirect} replace state={{ from: location }} />
  }

  return children
}

export default RouteGuard
