interface LibraryCardItem {
  title: string
  time: string
}

export interface LibraryCard {
  name: string
  icon: string
  public: string
  description: string
  is_common_id?: number | string
  items: LibraryCardItem[]
}
