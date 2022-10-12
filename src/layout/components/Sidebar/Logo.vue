<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" :to="jumpUrl">
        <img v-if="storeAvatar" :src="storeAvatar" class="sidebar-logo-smail">
        <h1 v-else class="sidebar-title">{{ storeName }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" :to="jumpUrl">
        <img v-if="storeAvatar" :src="storeAvatar" class="sidebar-logo">
        <div class="sidebar-title">{{ storeName }} {{ storeUserInfo.accountType==4? '('+storeUserInfo.userName+')' :''}} </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import avatar from '@/icons/avatar-default.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Element Admin',
      logo: '',
      jumpUrl:'/'
    }
  },
  computed: {
    ...mapState('user', {
      storeName: 'storeName',
      storeAvatar: 'storeAvatar',
      storeUserInfo:'storeUserInfo',
      accountType:'accountType'
    })
  },
  mounted() {
    console.log('storeUserInfo',this.storeUserInfo.accountType)
    if (this.storeUserInfo.accountType==4) {
      this.jumpUrl='/partnerModule/settlement/settlementList'
    } else{
      this.jumpUrl='/'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 30vh;
  //background: #2b2f3a;
  background: $heavyBGColor;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10vh;
      height: 10vh;
    }
    img{

      width: 120px;
      height: 120px;
    }

    & .sidebar-logo-smail {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
    }


    & .sidebar-title {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      margin: 0;
      color: $fontColor;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
