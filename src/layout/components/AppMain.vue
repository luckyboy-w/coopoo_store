<template>
  <section class="app-main" :class="{ 'app-main-bg': this.$route.path !== '/dashboard' }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-main {
  width: 100%;
  min-height: 80vh;
  margin-top: 4vh;
}

.app-main-bg{
  background: $heavyBGColor;
  box-shadow: 0px 1px 5px #ccc;
  padding: 3vh 1vw 2vh 1vw;
}
</style>

