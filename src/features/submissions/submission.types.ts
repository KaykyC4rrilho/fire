import type { LeadSource } from '../../types/lead'

export type Submission = {
  id: string
  name: string
  phone: string
  isChristian: boolean
  createdAt: string
} & LeadSource

export type SubmissionDraft = Pick<
  Submission,
  'name' | 'phone' | 'isChristian'
>

export type SubmissionFilter = 'all' | 'christian' | 'notChristian'
