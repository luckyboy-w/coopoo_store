<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <el-dialog :visible="showReset" v-if="showReset" @close="close()" title="密码重置" width="600px">
      <el-form ref="dataForm" :model="resetFrm" label-width="100px" style="width:500px">
        <el-form-item label="旧密码">
          <el-input v-model="resetFrm.oldPwd" placeholder="请输入密码" show-password clearable/>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="resetFrm.password" placeholder="请输入密码" show-password clearable/>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="resetFrm.reppwd" placeholder show-password clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReset()">提交</el-button>
          <el-button @click="showReset = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="right-menu">
      <div style="font-size:14px;float:left;padding:5px 40px 0px 0px">
        <el-row style="width:400px">
          <el-col></el-col>
        </el-row>
        <!-- <span style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">公司名称:{{bizName}} </span>
        <span style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">登录账号:{{loginName}}  </span>
        <span style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">最后一次登录时间:{{loginDate}} </span> -->
        <el-row style="width:800px">
          <el-col :span="6" style="font-size:14px">公司名称：{{ bizName }}</el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="6" style="font-size:14px">登录账号：{{ loginName }}</el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="10" style="font-size:14px">最后一次登录时间：{{ loginDate }}</el-col>
        </el-row>


      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showResetPwd()">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
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
    ])
  },
  mounted() {
    this.getUser()
  },
  methods: {
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
    getUser() {
      let scope = this
      getMethod('/bc/lyBuUser/getUser', {}).then(res => {
        let data = res.data
        if (data.enable == '0') {
          this.$essage({
            message: '账号被禁用',
            type: 'error',
            duration: 5 * 1000
          })
          scope.logout()
        }

        scope.bizName = data.bizName
        scope.loginName = data.loginName
        scope.loginDate = scope.fmtDate(data.loginDate)
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
  //height: 50px;
  height: $height;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid $lineColor;

  .hamburger-container {
    //line-height: 46px;
    line-height: $height;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $height;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
