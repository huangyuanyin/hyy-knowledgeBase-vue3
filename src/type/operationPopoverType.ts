import { Placement, TooltipTriggerType } from 'element-plus'

export interface MenuItem {
  type?: string
  icon?: string
  label?: string
  nick?: string
  desc?: string
  value?: string
}

export interface OperationPopoverProps {
  placement?: Placement
  width?: number
  height?: number
  trigger?: TooltipTriggerType
  hideAfter?: number
  showArrow?: boolean
  menuItems?: Array<MenuItem>
  currentSider?: string
  parent?: number
  userList?: any
  selectUserList?: any
  selectId?: string | number
  selectMenu?: string
  aInfo?: any
  startId?: string | number
  tag_mark?: string
  type?: string
  target_id?: string
  target_type?: string
}
