import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { message } from 'antd'
import { beforeEach } from './permission'
import { clearToken, getToken, isTokenExpired } from '../utils/request'

interface RouteGuardProps {
  children: ReactNode
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const location = useLocation()
  const token = getToken()

  if (token && isTokenExpired(token)) {
    clearToken()
    message.error('token已过期，请重新登录')
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const guardResult = beforeEach({ pathname: location.pathname })

  if (!guardResult.allow && guardResult.redirect) {
    return <Navigate to={guardResult.redirect} replace state={{ from: location }} />
  }

  return children
}

export default RouteGuard
