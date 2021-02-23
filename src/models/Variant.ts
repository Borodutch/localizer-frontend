import { Comment } from '@/models/Comment'

export interface Variant {
  _id: string

  username?: string
  text: string
  language: string
  selected: boolean
  upvotes: number
  downvotes: number

  comments: Comment[]
}
