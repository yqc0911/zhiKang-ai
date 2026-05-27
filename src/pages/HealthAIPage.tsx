import HomePage from '../component/HomePage'
import SimpleChat from '../component/SimpleChat'

const HealthAIPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <HomePage />
      </div>
      <div className="flex-1 min-h-0">
        <SimpleChat />
      </div>
    </div>
  )
}

export default HealthAIPage
