export type ConsultationArchivePayload = {
  id: string
  title: string
  summary: string
  messageCount: number
  archivedAt: string
}

type ConsultationGuardState = {
  hasConversation: () => boolean
  buildArchivePayload: () => ConsultationArchivePayload | null
  saveCurrentConsultation: () => Promise<boolean>
}

declare global {
  interface Window {
    __consultationGuardState?: ConsultationGuardState
  }
}

export const setConsultationGuardState = (state: ConsultationGuardState | null) => {
  if (state) {
    window.__consultationGuardState = state
  } else {
    delete window.__consultationGuardState
  }
}

export const getConsultationGuardState = () => window.__consultationGuardState
