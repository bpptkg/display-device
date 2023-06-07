<template>
  <div class="mx-1" style="margin-top: 60px">
    <keep-alive>
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'ModelingView',
  components: {},
}
</script>
