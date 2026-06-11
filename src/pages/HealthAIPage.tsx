import { useLocation } from 'react-router-dom'
import HomePage from '../component/HomePage'
import SimpleChat from '../component/SimpleChat'

const HealthAIPage = () => {
  const location = useLocation()
  const painParts = (location.state as { painParts?: string[] } | null)?.painParts || []
  const symptoms = (location.state as { symptoms?: string[] } | null)?.symptoms || []

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-shrink-0">
        <HomePage />
      </div>
      <div className="flex-1 min-h-0">
        <SimpleChat initialPainParts={painParts} initialSymptoms={symptoms} />
      </div>
    </div>
  )
}

export default HealthAIPage
