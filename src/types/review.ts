export interface ReviewWithUser {
  id: string
  rating: number
  title: string | null
  body: string | null
  user: {
    name: string | null
    image: string | null
  }
}
