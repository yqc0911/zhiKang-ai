import { createBrowserRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import Layout from '../pages/Layout'
import HealthAIPage from '../pages/HealthAIPage'
import HealthTipsPage from '../pages/HealthTipsPage'
import SymptomSelfCheckPage from '../pages/SymptomSelfCheckPage'
import HelpCenterPage from '../pages/HelpCenterPage'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'
import ContactUsPage from '../pages/ContactUsPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'
import RouteGuard from './RouteGuard'

const withGuard = (element: ReactElement) => <RouteGuard>{element}</RouteGuard>

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
        element: <NotFoundPage />,
    },
])

export default router
