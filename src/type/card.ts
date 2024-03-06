interface LibraryCardItem {
  title: string
  time: string
}

export interface LibraryCard {
  id: number
  name: string
  icon: string
  cover: string
  public: string
  description: string
  is_common_id?: number | string
  items: LibraryCardItem[]
}
