import { createBrowserRouter } from 'react-router-dom'
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
    },
    {
        path: '/health-ai',
        element: <HealthAIPage />,
    },
    {
        path: '/symptom-self-check',
        element: <SymptomSelfCheckPage />,
    },
    {
        path: '/health-tips',
        element: <HealthTipsPage />,
    },
    {
        path: '/help-center',
        element: <HelpCenterPage />,
    },
    {
        path: '/privacy-policy',
        element: <PrivacyPolicyPage />,
    },
    {
        path: '/contact-us',
        element: <ContactUsPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/profile',
        element: <ProfilePage />,
    },
])

export default router
