<template>

  <div class="container">
  	<div class="home">
  	<div class="loginbg">
  		<div class="logo">
        <img style="width: 100%;height: 100%;object-fit: contain;" src="../../icons/logo.png" />
      </div>
      <div class="welcome">
        <img style="width: 100%;height: 100%;object-fit: contain;" src="../../icons/welcome.png" />
      </div>
  		<div class="text">欢迎登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;靠谱家门店管理系统</div>
  		<div class="form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
<!--
          <div class="title-container">
            <h3 class="title">
              {{ $t('login.title') }}
            </h3>

          </div> -->
          <!-- <lang-select style="margin-left: 280px;" class="set-language" /> -->
          <el-form-item prop="username">
           <!-- <span class="svg-container">
              <svg-icon icon-class="user" />
            </span> -->
            <el-input
            style="margin-top: 25px;"
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
             <!-- <span class="svg-container">
                <svg-icon icon-class="password" />
              </span> -->
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              /><div style="position: absolute;margin-top: -40px;right: 50px;"><span @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span></div>

            </el-form-item>
          </el-tooltip>

          <el-button :loading="buLoading" type="primary" style="border-radius: 25px; height: 47px; width:93%;margin-bottom:30px;" @click.native.prevent="handleLogin">
            门店登录
          </el-button>
        </el-form>


      </div>
  	</div>
  	</div>
  </div>
<!--
  <div class="login-container">


  </div> -->
</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './components/SocialSignin'
import { getMethod, postMethod } from '@/api/request'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请确认账户名称正确'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于六位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      buLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              console.log('getUserInfo',res.data)
              if (res.data.accountType==4) {
                console.log(88888888)
                // this.$router.push({ path: '/' })
                this.$router.push({ path: '/partnerModule/settlement/settlementList' })
              } else{
                this.$router.push({ path: '/' })
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.container{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-width: 1000px;
		/* z-index: -100; */
		zoom: 1;
		background-color: #fff;
		background: url(https://bucket.coopoo.com/images/store.png) no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;
	}
	.home{
		 width:808px;
		    height: 477px;
		    /* background:skyblue; */
			position: absolute;
			background: url(../../icons/home.png);
			background-size: cover;
			/* z-index: -99; */
			zoom: 1;
		    left:50%;
		    top:50%;
		    margin-left:-404px;
		    margin-top:-280px;
	}
	.loginbg{
		margin-left: 90px;
		    width: 300px;
		    height: 380px;
		    left: 50px;
		    padding-top: 40px;
	}
	.text{
		font-size: 18px;
    margin-left: 10px;
    color: #FFFFFF;
		/* margin-top: -350px; */
		/* margin-left: 100px; */
		/* height: 20px; */
		 // background:greenyellow;
	}
	.logo{
		margin: 20px 0 30px 100px;
		    font-size: 50px;
		    width: 90px;
		    height: 90px;
		// background-color: #000FFF;
	}
  .welcome{
  	    position: absolute;
  	    width: 500px;
  	    height: 95px;
  	    left: 500px;
  	    top: 310px;
  }
	.form{
		width: 100%;
		height: 300px;
		// background-color: grey;
    .el-input--medium .el-input__inner {
      border-radius: 25px;
      width: 93%;
        height: 47px;
        line-height: 36px;
    }
    .el-button--primary {
        color: #fff;
        background-color: #A49E83;
        border-color: #A49E83;
    }
	}

/* reset element-ui css */

</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
