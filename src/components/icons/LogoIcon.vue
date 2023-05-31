<template>
  <div class="logo-wrapper">
    <div class="brand-logo">
      <span class="text-title">Davis - Data Visualization System</span>
    </div>
    <div class="brand-logo-short">
      <span class="text-title">Davis</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoIcon',
}
</script>

<style lang="scss" scoped>
.brand-logo {
  display: block;

  &-short {
    display: none;
  }
}

.text-title {
  text-decoration: none;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
}

@media (max-width: 991.98px) {
  .brand-logo {
    display: none;

    &-short {
      display: block;
    }
  }
}
</style>
