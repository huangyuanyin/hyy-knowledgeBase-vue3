const list = [
  {
    id: 68,
    create_datetime: '2023-10-20 14:37:35',
    update_datetime: '2023-10-20 14:37:35',
    children: [
      {
        id: 69,
        create_datetime: '2023-10-20 14:37:59',
        update_datetime: '2023-10-20 14:37:59',
        children: [
          {
            id: 72,
            create_datetime: '2023-10-20 14:50:15',
            update_datetime: '2023-10-20 14:50:15',
            children: null,
            description: null,
            creator: 'maxf',
            modifier: 'maxf',
            title: 'eeeee',
            type: 'doc',
            slug: 'e3d3709391bc4ad9bab00df55da46e39',
            status: 'p',
            open_windows: '0',
            pluginkey: '',
            pluginver: '',
            sort: 1,
            version: 1,
            is_delete: '0',
            book: 64,
            space: 70,
            parent: 69
          },
          {
            id: 71,
            create_datetime: '2023-10-20 14:48:22',
            update_datetime: '2023-10-20 14:48:22',
            children: null,
            description: null,
            creator: 'maxf',
            modifier: 'maxf',
            title: 'eeeee',
            type: 'doc',
            slug: 'f3026b8c61984bd48c8e2d0bcaa0537c',
            status: 'p',
            open_windows: '0',
            pluginkey: '',
            pluginver: '',
            sort: 1,
            version: 1,
            is_delete: '0',
            book: 64,
            space: 70,
            parent: 69
          },
          {
            id: 70,
            create_datetime: '2023-10-20 14:38:07',
            update_datetime: '2023-10-20 14:38:07',
            children: null,
            description: null,
            creator: 'maxf',
            modifier: 'maxf',
            title: '测试9199999',
            type: 'doc',
            slug: 'b9ab5f810e664772ac936604de8bf43c',
            status: 'p',
            open_windows: '0',
            pluginkey: '',
            pluginver: '',
            sort: 1,
            version: 1,
            is_delete: '0',
            book: 64,
            space: 70,
            parent: 69
          }
        ],
        description: null,
        creator: 'maxf',
        modifier: 'maxf',
        title: '测试9199999',
        type: 'doc',
        slug: '6a9d8249c23b44cf8fd8faf332365d99',
        status: 'p',
        open_windows: '0',
        pluginkey: '',
        pluginver: '',
        sort: 1,
        version: 1,
        is_delete: '0',
        book: 64,
        space: 70,
        parent: 68
      }
    ],
    description: null,
    creator: 'maxf',
    modifier: 'maxf',
    title: '测试9199999',
    type: 'doc',
    slug: '4c816f01669a496081cebc33fa060dae',
    status: 'p',
    open_windows: '0',
    pluginkey: '',
    pluginver: '',
    sort: 1,
    version: 1,
    is_delete: '0',
    book: 64,
    space: 70,
    parent: null
  },
  {
    id: 67,
    create_datetime: '2023-10-20 14:37:26',
    update_datetime: '2023-10-20 14:37:26',
    children: [
      {
        id: 73,
        create_datetime: '2023-10-20 15:02:13',
        update_datetime: '2023-10-20 15:02:13',
        children: [
          {
            id: 74,
            create_datetime: '2023-10-20 15:02:33',
            update_datetime: '2023-10-20 15:02:33',
            children: null,
            description: null,
            creator: 'maxf',
            modifier: 'maxf',
            title: 'eeeee',
            type: 'doc',
            slug: '8e6587061582454192ba1bb011bac215',
            status: 'p',
            open_windows: '0',
            pluginkey: '',
            pluginver: '',
            sort: 1,
            version: 1,
            is_delete: '0',
            book: 64,
            space: 70,
            parent: 73
          }
        ],
        description: null,
        creator: 'maxf',
        modifier: 'maxf',
        title: 'eeeee',
        type: 'doc',
        slug: 'edbe87dd6ce241d8bf3c90e7d58577f0',
        status: 'p',
        open_windows: '0',
        pluginkey: '',
        pluginver: '',
        sort: 1,
        version: 1,
        is_delete: '0',
        book: 64,
        space: 70,
        parent: 67
      }
    ],
    description: null,
    creator: 'maxf',
    modifier: 'maxf',
    title: '测试91',
    type: 'doc',
    slug: '60b5f7bc115b490798c6a864231e99f5',
    status: 'p',
    open_windows: '0',
    pluginkey: '',
    pluginver: '',
    sort: 1,
    version: 1,
    is_delete: '0',
    book: 64,
    space: 70,
    parent: null
  },
  {
    id: 66,
    create_datetime: '2023-10-20 14:36:58',
    update_datetime: '2023-10-20 14:36:58',
    children: null,
    description: null,
    creator: 'maxf',
    modifier: 'maxf',
    title: '测试9',
    type: 'doc',
    slug: 'eca7e449b7c04aaab682f1bcaab1301c',
    status: 'p',
    open_windows: '0',
    pluginkey: '',
    pluginver: '',
    sort: 1,
    version: 1,
    is_delete: '0',
    book: 64,
    space: 70,
    parent: null
  }
]

const result = []

export const useArrayToTree = (list, parent, result) => {
  list.forEach((item, index) => {
    if (item.parent == parent) {
      item = { ...item, children: [] }
      result.push(item)
      useArrayToTree(list, item.id, item.children)
    }
  })
}

useArrayToTree(list, null, result)

console.log(result)
