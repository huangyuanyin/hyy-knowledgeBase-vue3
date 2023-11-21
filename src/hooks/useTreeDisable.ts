/**
 * el-tree中禁用目标节点与其所有子节点
 * @param initialTree 树结构数据
 * @param targetId 目标节点id
 */

interface TreeNode {
  id: number
  disabled?: boolean
  children?: TreeNode[]
}

interface UseTreeDisable {
  treeData: Ref<TreeNode[]>
  disableNodeAndChildren: (targetId: number) => void
}

export const useTreeDisable = (initialTree: TreeNode[]): UseTreeDisable => {
  const treeData = ref<TreeNode[]>(initialTree)

  const disableNodeAndChildren = (targetId: number, tree: TreeNode[] = treeData.value): void => {
    for (const node of tree) {
      if (node.id === targetId) {
        node.disabled = true
        node.children && disableChildren(node.children)
      } else if (node.children && node.children.length > 0) {
        disableNodeAndChildren(targetId, node.children)
      }
    }
  }

  const disableChildren = (children: TreeNode[]): void => {
    for (const child of children) {
      child.disabled = true
      if (child.children && child.children.length > 0) {
        disableChildren(child.children)
      }
    }
  }

  return {
    treeData,
    disableNodeAndChildren
  }
}
