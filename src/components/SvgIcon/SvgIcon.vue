<script lang="ts" setup>
import { useSvgIcon } from './hooks/useSvgIcon'
import { SvgIconProps } from '@/type/SvgIconType'

const props = defineProps<SvgIconProps>()

const { svgName, svgClassName, color } = useSvgIcon(props)
</script>

<template>
  <svg :class="svgClassName" aria-hidden="true">
    <use :xlink:href="svgName" :fill="color" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
