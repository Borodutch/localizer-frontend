import { Variant } from '@/models/Variant'

export interface Localization {
  _id: string
  key: string
  createdAt: Date

  tags: string[]
  variants: Variant[]
}
