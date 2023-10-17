interface LibraryCardItem {
  title: string
  time: string
}

export interface LibraryCard {
  name: string
  public: string
  description: string
  items: LibraryCardItem[]
}
