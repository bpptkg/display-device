<template>
  <div class="scrollwrapper">
    <div class="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrollwrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: -15px;
  overflow-y: scroll;
  overflow-x: hidden;
}

@media (max-width: 575.98px) {
  .wrapper {
    right: 0;
  }
}
</style>
