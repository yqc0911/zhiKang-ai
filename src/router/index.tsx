import { Suspense, lazy } from 'react'
import type { ReactElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RouteGuard from './RouteGuard'

const Layout = lazy(() => import('../pages/Layout'))
const HealthAIPage = lazy(() => import('../pages/HealthAIPage'))
const HealthTipsPage = lazy(() => import('../pages/HealthTipsPage'))
const SymptomSelfCheckPage = lazy(() => import('../pages/SymptomSelfCheckPage'))
const HelpCenterPage = lazy(() => import('../pages/HelpCenterPage'))
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'))
const ContactUsPage = lazy(() => import('../pages/ContactUsPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const PageLoading = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        页面加载中...
    </div>
)

const withSuspense = (element: ReactElement) => (
    <Suspense fallback={<PageLoading />}>{element}</Suspense>
)

const withGuard = (element: ReactElement) => withSuspense(<RouteGuard>{element}</RouteGuard>)

const router = createBrowserRouter([
    {
        path: '/',
        element: withGuard(<Layout />),
    },
    {
        path: '/health-ai',
        element: withGuard(<HealthAIPage />),
    },
    {
        path: '/symptom-self-check',
        element: withGuard(<SymptomSelfCheckPage />),
    },
    {
        path: '/health-tips',
        element: withGuard(<HealthTipsPage />),
    },
    {
        path: '/help-center',
        element: withGuard(<HelpCenterPage />),
    },
    {
        path: '/privacy-policy',
        element: withGuard(<PrivacyPolicyPage />),
    },
    {
        path: '/contact-us',
        element: withGuard(<ContactUsPage />),
    },
    {
        path: '/login',
        element: withGuard(<LoginPage />),
    },
    {
        path: '/register',
        element: withGuard(<RegisterPage />),
    },
    {
        path: '/profile',
        element: withGuard(<ProfilePage />),
    },
    {
        path: '*',
        element: withGuard(<NotFoundPage />),
    },
])

export default router
