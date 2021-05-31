<template>
  <div>
    <div v-if="showList" class="list-panel">
      <table>
        <tr>
          <td>
            <el-button type="primary" @click="addOrEditUser()">新增用戶</el-button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td style="line-height:20px">&nbsp;</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colspan="4">
            <el-table
              :data="userList"
              style="width: 100%; margin-bottom: 20px;"
              row-key="id"
              border
            >
              <el-table-column label="姓名" width="180" prop="name"></el-table-column>
              <el-table-column label="登录账号" width="180" prop="loginName"></el-table-column>
              <el-table-column label="邮箱" width="180" prop="email"></el-table-column>
              <el-table-column label="最近登录时间" width="180" prop="loginDate">
                <template slot-scope="scope">
                  {{ scope.row.loginDate |_formatDate }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="280"
              >
                <template slot-scope="scope">
                  <el-button-group>
                    <!--                  <el-link type="primary" @click="editSysUser(scope.row)">编辑</el-link>-->
                    <el-button size="mini" type="primary" @click="editSysUser(scope.row)">编辑</el-button>

                    <!--                  <el-link type="primary" @click="resetPwd(scope.row)">密码重置</el-link>-->
                    <el-button size="mini" type="primary" @click="resetPwd(scope.row)">密码重置</el-button>

                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
      </table>
    </div>

    <el-dialog :visible="showReset" v-if="showReset" title="密码重置" width="600px">
      <el-form ref="dataForm" :model="resetFrm" label-width="100px" style="width:500px">
        <el-form-item label="密码">
          <el-input
            v-model="resetFrm.password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="resetFrm.reppwd"
            placeholder=""
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReset()">提交</el-button>
          <el-button @click="cancelSubmit()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <addUser ref="addOrEditRef" v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel"/>
  </div>
</template>

<script>
import addUser from './add'
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'

export default {
  components: { addUser },
  data() {
    return {
      editData: {
        password: '',
        reppwd: ''
      },
      resetFrm: {
        buUserId: '',
        password: '',
        reppwd: ''
      },
      showReset: false,
      showList: true,
      showAddOrEdit: false,
      userList: []
    }
  },
  computed: {},
  mounted() {
    this.loadUser()
  },
  filters: {
    _formatDate(time) {
      if (time == undefined) {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created() {
  },
  methods: {
    submitReset() {

      let scope = this

      if (this.resetFrm.password != this.resetFrm.reppwd) {
        this.$message({
          message: '两次输入的密码不一致',
          type: 'warring'
        })
        return
      }

      postMethod('/bc/menu/resetPwd', this.resetFrm).then(res => {
        this.$message({
          message: '重置完成',
          type: 'success'
        })
        this.showList = true
        this.showReset = false
      })
    },
    cancelSubmit() {
      this.showList = true
      this.showReset = false
    },
    resetPwd(row) {
      let scope = this
      scope.resetFrm.buUserId = row.buUserId
      this.showReset = true
      this.showAddOrEdit = false
    },
    editSysUser(row) {
      let param = {
        id: row.buUserId
      }
      getMethod('/bc/menu/findById', param).then(res => {
        this.showAddOrEdit = true
        this.showList = false
        this.editData = res.data
      })
    },
    deleteUsr(row) {
      let param = {
        sys_user_id: row.sysUserId
      }
      postMethod('/backend/user/deleteById', param).then(res => {
      })
    },
    addOrEditUser() {
      this.showList = false
      this.showAddOrEdit = true
    },
    showListPanel(isCancel) {
      this.loadUser()
      this.showList = true
      this.showAddOrEdit = false
      // if (!isCancel) {
      //   this.loadUser()
      // }
    },
    loadUser() {
      const scope = this
      getMethod('/bc/menu/getBizUser', '').then(res => {
        scope.userList = res.data.list
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
