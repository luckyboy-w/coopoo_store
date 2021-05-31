<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"
    />
    <div class="navbar-tag-container">
      <tags-view v-if="needTagsView"/>
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import { mapGetters, mapState, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import TagsView from '@/layout/components/TagsView'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search,
    TagsView
  },
  data() {
    return {
      loginName: '',
      loginDate: '',
      bizName: '',
      showReset: false,
      resetFrm: {
        oldPwd: '',
        password: '',
        reppwd: '',
        obj: ''
      }
    }
  },
  computed: {
    obj() {
      return this.resetFrm.password.length
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState({
      needTagsView: state => state.settings.tagsView
    }),
    ...mapState('user', {
      supplierName: 'supplierName',
      supplierAvatar: 'supplierAvatar'
    })
  },
  mounted() {
    // 此时外层是异步的 并不影响最终的数据回显 所以没设置同步
    this.getUserInfo()
  },
  methods: {
    ...mapActions('user', {
      getUserInfo: 'getUserInfo'
    }),
    close() {
      this.showReset = false
      console.log('44444')
    },
    showResetPwd() {
      this.showReset = true
    },
    submitReset() {

      console.log(this.obj, '密码')
      let scope = this
      if (this.resetFrm.password == '' || this.resetFrm.oldPwd == '') {
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        })
        return
      }
      if (this.obj < 6) {
        this.$message({
          message: '密码不能小于6位数',
          type: 'warning'
        })
        return
      }

      if (this.resetFrm.password != this.resetFrm.reppwd) {
        this.$message({
          message: '俩次输入的新密码不一致',
          type: 'warning'
        })
        return
      }
      postMethod('/bc/lyBuUser/resetPwd', this.resetFrm).then((res) => {
        if (res.data == 1) {
          this.$message({
            message: '旧密码不匹配，请重新输入',
            type: 'warning'
          })
        } else if (res.data == 2) {
          this.$message({
            message: '密码重置失败，请稍后再试',
            type: 'warning'
          })
        } else {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.showReset = false
        }

      })
    },
    fmtDate(date) {
      let dt = new Date(date)
      if (date == undefined) {
        dt = new Date()
      }
      return formatDate(dt, 'yyyy-MM-dd hh:mm')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$height: 5vh;

.navbar {
  display: flex;
  height: $height;
  line-height: calc(#{$height} - 4px);
  //overflow: hidden;
  position: relative;
  border-bottom: 1px solid $lineColor;

  .hamburger-container {
    display: block;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .navbar-tag-container {
    width: 97%;
    height: $height;
  }
}
</style>
