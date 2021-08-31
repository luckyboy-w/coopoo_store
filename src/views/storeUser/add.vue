<template>
  <div class="update-form-panel" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="userName" label="姓名">
        <el-input v-model="form.userName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="workPosition " label="岗位">
        <el-input v-model="form.workPosition " placeholder="请输入岗位名称" clearable />
      </el-form-item>
      <el-form-item prop="account" label="登录账号">
        <el-input :disabled="disabledLoginName" v-model="form.account" placeholder="请输入登录账号" clearable />
      </el-form-item>
      <el-form-item prop="password" label="密码" v-if="showPwd">
        <el-input v-model="form.password" placeholder="请输入密码" show-password clearable />
      </el-form-item>
      <el-form-item prop="reppwd" label="确认密码" v-if="showPwd">
        <el-input v-model="form.reppwd" placeholder="请确认密码" show-password clearable />
      </el-form-item>
      <el-form-item prop="roleId" label="角色">
        <el-select v-model="form.roleId" placeholder="请选择角色">
          <el-option v-for="item in roleData" :key="item.id" :value-key="item.id" :label="item.name"
            :value="item.id" />
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
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  export default {
    data() {
      return {
        loading: false,
        roleData: [],
        showPwd: true,
        disabledLoginName: false,
        form: {
          userName: '',
          workPosition : '',
          account: '',
          password: '',
          reppwd: '',
          roleId: '',
        },
        rules: {
          userName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          workPosition : [{
            required: true,
            message: '请输入岗位',
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          reppwd: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          roleId: [{
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }],
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
      console.log(this.editData,'this.editData')
      if (this.editData.id) {
        console.log(this.editData.id)
        this.disabledLoginName = true
        this.form = this.editData
        this.showPwd = false
      }
    },
    created() {},
    methods: {
      loadRole() {
        const scope = this
        getMethod('/permission/get-role-list').then(res => {
          scope.roleData = res.data.records
        })
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      submitUpdate() {
        let scope = this
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.reppwd != this.form.password) {
              this.$message({
                message: "两次输入的密码不一致",
                type: "warring"
              });
              return;
            }
            // this.loading = true
            delete this.form.reppwd
            console.log(this.editData.id)
            if (!this.editData.id||this.editData.id=='') {
              postMethod('/permission/add-account', this.form).then(res => {
              this.loading = false
              scope.roleData = res.data
              if (res.errCode != 0) {
                this.$message({
                  message: res.message,
                  type: "warning"
                });
                return
              }
              this.$emit('showListPanel', true)
              this.$message({
                message: "保存成功",
                type: "success"
              });
            })
            } else{
              this.form.id=this.editData.id
              postMethod('/permission/update-account', this.form).then(res => {
                this.loading = false
                scope.roleData = res.data

                if (res.errCode != 0) {
                  this.$message({
                    message: res.message,
                    type: "warning"
                  });
                  return
                }
                this.$emit('showListPanel', true)
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              })
            }

          } else {
            this.loading = false
            return false;
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 600px;
  }
</style>
