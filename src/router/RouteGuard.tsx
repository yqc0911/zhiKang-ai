import { Navigate, useLocation } from 'react-router-dom'
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
  const token = getToken()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)

  const guardResult = useMemo(() => beforeEach({ pathname: location.pathname }), [location.pathname])

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      clearToken()
      message.error('token已过期，请重新登录')
      setTokenExpired(true)
      setRedirectTo('/login')
      return
    }

    if (!guardResult.allow && guardResult.redirect) {
      setRedirectTo(guardResult.redirect)
    } else {
      setRedirectTo(null)
    }
  }, [guardResult.allow, guardResult.redirect, token])

  if (tokenExpired && redirectTo) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (!guardResult.allow && guardResult.redirect) {
    return <Navigate to={guardResult.redirect} replace state={{ from: location }} />
  }

  return children
}

export default RouteGuard
