export type LeadOrigin = 'conference' | 'participation' | 'manual'

export type LeadSource = {
  origin: LeadOrigin
  conferenceSlug: string | null
}

export type LeadFormData = {
  name: string
  phone: string
  isChristian: 'sim' | 'nao'
}

export type LeadSubmissionData = LeadFormData & LeadSource
