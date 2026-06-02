import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { beforeEach } from './permission'
import { clearToken, getToken, isTokenExpired } from '../utils/request'

interface RouteGuardProps {
  children: ReactNode
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  const guardResult = useMemo(() => beforeEach({ pathname: location.pathname }), [location.pathname])

  useEffect(() => {
    const handleAuthExpired = () => {
      message.error('token已过期，请重新登录')
      setRedirectTo('/login')
      navigate('/login', { replace: true, state: { from: location } })
    }

    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [location, navigate])

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      clearToken()
      window.dispatchEvent(new Event('auth:expired'))
      return
    }

    if (!guardResult.allow && guardResult.redirect) {
      setRedirectTo(guardResult.redirect)
    } else {
      setRedirectTo(null)
    }
  }, [guardResult.allow, guardResult.redirect, token])

  if (!guardResult.allow && guardResult.redirect) {
    return <Navigate to={guardResult.redirect} replace state={{ from: location }} />
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return children
}

export default RouteGuard
