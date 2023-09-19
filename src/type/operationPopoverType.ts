import { Placement, TooltipTriggerType } from 'element-plus'

export interface MenuItem {
  type?: string
  icon?: string
  label?: string
  desc?: string
}

export interface OperationPopoverProps {
  placement?: Placement
  width?: number
  trigger?: TooltipTriggerType
  hideAfter?: number
  showArrow?: boolean
  menuItems?: Array<MenuItem>
  currentSider?: string
}
