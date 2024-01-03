export interface ArticleInfo {
  id: number
  title: string
  book: number
  space: number
  body: string
  type: string
  mark_id: number
  tag_mark: string
  marked: boolean
  counts: number
  views: number
  comments_count: number
  creator_name: string
  create_datetime: string
  update_datetime: string
  children: ArticleInfo[] | null
}
