<template>
  <div class="update-form-panel">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
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
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码">
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
            :key="item.id"
            :value-key="id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
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
  computed: {
  },
  mounted() {
    this.loadRole()
  },
  created() {},
  methods: {
    loadRole() {
      const scope = this

      getMethod('/backend/role/getRole', '').then(res => {
        scope.roleData = res.data
      })
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      this.$emit('showListPanel', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel{
  padding:30px 20px;
  width: 600px;
}
</style>
