export type TargetType = 'book' | 'group'

export type isDefaultType = '0' | '1' // 0：团队，1：公共区

export type ArticleType = {
  [key: string]: {
    type: string
    title: string
    body: string
  }
}

export type Callback = (res: any) => void
