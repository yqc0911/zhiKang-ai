import { useLocation } from 'react-router-dom'
import HomePage from '../component/HomePage'
import SimpleChat from '../component/SimpleChat'

const HealthAIPage = () => {
  const location = useLocation()
  const painParts = (location.state as { painParts?: string[] } | null)?.painParts || []
  const symptoms = (location.state as { symptoms?: string[] } | null)?.symptoms || []

  return (
    <div className="min-h-screen bg-slate-50">
      <HomePage />
      <div className="min-h-[calc(100vh-4rem)]">
        <SimpleChat initialPainParts={painParts} initialSymptoms={symptoms} />
      </div>
    </div>
  )
}

export default HealthAIPage
