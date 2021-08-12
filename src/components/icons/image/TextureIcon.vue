<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    :viewBox="viewBox"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.88 3L3 11.88V14.71L14.71 3H11.88ZM19.51 3.07999L3.08002 19.51C3.17004 19.85 3.35004 20.16 3.59003 20.41C3.84003 20.65 4.15002 20.83 4.48999 20.92L20.93 4.48999C20.74 3.79999 20.2 3.25998 19.51 3.07999ZM3 5C3 3.89999 3.90002 3 5 3H7L3 7V5ZM19 21C19.55 21 20.05 20.78 20.41 20.41C20.78 20.05 21 19.55 21 19V17L17 21H19ZM12.12 21H9.28998L21 9.29001V12.12L12.12 21Z"
    />
  </svg>
</template>

<script>
import iconMixin from '../mixin'

export default {
  name: 'TextureIcon',
  mixins: [iconMixin],
}
</script>
