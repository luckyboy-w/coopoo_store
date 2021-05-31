<template>
  <div class="update-form-panel">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="登录账号">
        <el-input
          v-model="form.loginName"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码" v-if="showPwd">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" v-if="showPwd">
        <el-input
          v-model="form.reppwd"
          placeholder=""
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleData"
            :key="item.pkRoleId"
            :value-key="pkRoleId"
            :label="item.roleName"
            :value="item.pkRoleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">提交</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'

export default {
  data() {
    return {
      roleData: [],
      showPwd: true,
      form: {
        name: '',
        loginName: '',
        email: '',
        password: '',
        reppwd: '',
        roleId: ''
      }
    }
  },
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  computed: {},
  mounted() {
    this.loadRole()

    if (this.editData.buUserId) {
      this.form = this.editData
      this.showPwd = false
    }
  },
  created() {
  },
  methods: {
    loadRole() {
      const scope = this

      getMethod('/bc/menu/getRole', '').then(res => {
        scope.roleData = res.data
      })
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      let scope = this
      if (this.form.buUserId == '') {
        if (this.form.reppwd != this.form.password) {
          this.$message({
            message: '两次输入的密码不一致',
            type: 'warning'
          })
          return
        }

        if (this.form.reppwd.length < 6) {
          this.$message({
            message: '密码长度不能少于6位',
            type: 'warning'
          })
          return
        }
      } else {
        this.form.createDate = undefined
      }

      if (this.form.roleId == '' || this.form.roleId == undefined) {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        return
      }

      postMethod('/bc/menu/addBizUser', this.form).then(res => {
        scope.roleData = res.data
        this.isEdit = false
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.$emit('showListPanel', false)
      })

    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 600px;
}
</style>
