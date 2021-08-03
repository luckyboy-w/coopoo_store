<template>

  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <!--    不使用动画,代码保留-->
    <!--    <transition-group name="sidebarBottomFade">-->
	<div v-if="collapse" key="collapse" class="sidebar-logo-link" @click="downQrcode()">
	  <img :src="qrCode" class="sidebar-logo">
	  <span class="sidebar-title" style="visibility: hidden">门店二维码</span>
	</div>
	<div v-else key="expand" class="sidebar-logo-link" @click="downQrcode()">
	  <img :src="qrCode" class="sidebar-logo">
	  <span class="sidebar-title">门店二维码</span>
	</div>
    <div v-if="collapse" key="collapse1" class="sidebar-logo-link" @click="showResetPwd()">
      <img :src="ChangePasswd" class="sidebar-logo">
      <span class="sidebar-title" style="visibility: hidden">修改密码</span>
    </div>
    <div v-else key="expand1" class="sidebar-logo-link" @click="showResetPwd()">
      <img :src="ChangePasswd" class="sidebar-logo">
      <span class="sidebar-title">修改密码</span>
    </div>
    <div v-if="collapse" key="collapse2" class="sidebar-logo-link" @click="logout">
      <img :src="Logout" class="sidebar-logo">
      <span class="sidebar-title" style="visibility: hidden">退出登录</span>
    </div>
    <div v-else key="expand2" class="sidebar-logo-link" @click="logout">
      <img :src="Logout" class="sidebar-logo">
      <span class="sidebar-title">退出登录</span>
    </div>
    <!--    </transition-group>-->


    <el-dialog :visible="showReset" @close="close()" title="密码重置" width="600px" :modal-append-to-body="false">
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
  </div>
</template>

<script>
import Logout from '@/assets/logout.png'
import ChangePasswd from '@/assets/changePasswd.png'
import qrCode from '@/assets/qrCode.png'
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import {getToken} from '@/utils/auth'

export default {
  name: 'NavButtomButton',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      storeId:'',
      qrCode:qrCode,
      Logout: Logout,
      ChangePasswd: ChangePasswd,
      loginName: '',
      loginDate: '',
      bizName: '',
      showReset: false,
      resetFrm: {
        oldPwd: '',
        password: '',
        reppwd: '',
        obj: '',
        id:''
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    close() {
      this.resetFrm={}
      this.showReset = false
    },
    showResetPwd() {
      this.getUser()
      this.showReset = true
    },
    downQrcode(){
      console.log('1111',getToken(),this.storeId);
      window.open( process.env.VUE_APP_BASE_API+'/home/download-qr-code?storeId='+this.storeId)
      // ?token='+getToken()
    },
    submitReset() {
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
      let param={
        newPwd:this.resetFrm.password,
        oldPwd:this.resetFrm.oldPwd
      }
      postMethod('/login/reset-pwd', param).then((res) => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.showReset = false
          this.logout()
      })
    },
    getUser() {
      let scope = this
      getMethod('/permission/get-current-account-info').then(res => {
		  console.log('data',res);
        scope.resetFrm.id=res.data.id
        scope.storeId=res.data.storeId
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

.sidebar-logo-container {
  margin-top: 15vh;
  //width: 100%;
  width: $sideBarWidth;
  height: 15vh;
  overflow: hidden;

  & .sidebar-logo-link {
    line-height: 5vh;
    padding-left: 20px;
    height: 5vh;
    //width: 100%;
    width: $sideBarWidth;

    & .sidebar-logo {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 16px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: $fontColor;
      font-weight: 500;
      font-size: 14px;
      vertical-align: middle;
    }

    &:hover {
      background: $themeColor;
      cursor: pointer;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}

.sidebarBottomFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarBottomFade-enter,
.sidebarBottomFade-leave-to {
  opacity: 0;
}
</style>
