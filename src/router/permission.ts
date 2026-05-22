export const routeWhiteList = [
  '/',
  '/symptom-self-check',
  '/health-tips',
  '/help-center',
  '/privacy-policy',
  '/contact-us',
  '/login',
  '/register',
]

interface BeforeEachOptions {
  pathname: string
}

interface BeforeEachResult {
  allow: boolean
  redirect?: string
}

export const isLoggedIn = () => {
  return Boolean(localStorage.getItem('token') || localStorage.getItem('userInfo'))
}

export const beforeEach = ({ pathname }: BeforeEachOptions): BeforeEachResult => {
  const inWhiteList = routeWhiteList.includes(pathname)

  if (inWhiteList) {
    return { allow: true }
  }

  if (!isLoggedIn()) {
    return { allow: false, redirect: '/login' }
  }

  return { allow: true }
}
