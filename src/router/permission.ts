export const routeWhiteList = [
  '/',
  '/symptom-self-check',
  '/health-tips',
  '/help-center',
  '/privacy-policy',
  '/contact-us',
  '/login',
  '/register',
  '/shop',
  '/cart',
  '/pay',
]

interface BeforeEachOptions {
  pathname: string
}

interface BeforeEachResult {
  allow: boolean
  redirect?: string
}

import { clearToken, getToken, isTokenExpired } from '../utils/request'

export const isLoggedIn = () => {
  const token = getToken()

  if (!token) return false

  if (isTokenExpired(token)) {
    clearToken()
    return false
  }

  return Boolean(token || localStorage.getItem('userInfo'))
}

export const beforeEach = ({ pathname }: BeforeEachOptions): BeforeEachResult => {
  const inWhiteList = routeWhiteList.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (inWhiteList) {
    return { allow: true }
  }

  if (!isLoggedIn()) {
    return { allow: false, redirect: '/login' }
  }

  return { allow: true }
}
