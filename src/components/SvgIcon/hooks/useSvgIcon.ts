import { SvgIconProps } from '@/type/SvgIconType'

export const useSvgIcon = ({ iconName, className = '', color = '#409eff' }: SvgIconProps) => {
  const svgName: Ref<string> = computed(() => {
    return `#${iconName}`
  })

  const svgClassName: Ref<string> = computed(() => {
    if (className) {
      return `svg-icon ${className}`
    }
    return 'svg-icon'
  })

  return {
    svgName,
    svgClassName,
    color
  }
}
