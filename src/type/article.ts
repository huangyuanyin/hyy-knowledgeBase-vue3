export interface ArticleInfo {
  id: number
  title: string
  description: string
  book: number
  space: number
  body: string
  type: string
  public: string
  mark_id: number
  tag_mark: string
  marked: boolean
  counts: number
  views: number
  comments_count: number
  like_id: number
  liked: boolean
  likes_count: number
  versions_count: number
  open_windows: string
  creator_name: string
  create_datetime: string
  update_datetime: string
  children: ArticleInfo[] | null
}
