<template>
  <div>
    <div v-show="showList" class="list-panel">
      <table>
        <tr>
          <td><el-button @click="addOrEditUser()">新增用戶</el-button> <el-button @click="delPermission()">刪除角色</el-button> </td>
          <td />
        </tr>
        <tr>
          <td style="line-height:40px">&nbsp;</td>
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td colspan="4">
            <el-table
              :data="userList"
              style="width: 100%"
            >
              <el-table-column
                label="登录账号"
                width="180"
              >
                <template slot-scope="scope">
                  <i class="el-icon-time" />
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="姓名"
                width="180"
              >
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="280"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  >禁用</el-button>
                  <!-- <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">密码重置</el-button> -->
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
      </table>
    </div>
    <addUser v-show="showAddOrEdit" @showListPanel="showListPanel" />
  </div>
</template>

<script>
import addUser from './add'
import { getMethod, postMethod } from '@/api/request'

export default {
  components: { addUser },
  data() {
    return {
      showList: true,
      showAddOrEdit: false,
      userList: []
    }
  },
  computed: {
  },
  mounted() {
    this.loadUser()
  },
  created() { },
  methods: {
    addOrEditUser() {
      this.showList = false
      this.showAddOrEdit = true
    },
    showListPanel(isCancel) {
      this.showList = true
      this.showAddOrEdit = false

      if (!isCancel) {
        this.loadUser()
      }
    },
    loadUser() {
      const scope = this

      getMethod('/backend/user/getUser', '').then(res => {
        scope.roleData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-panel{
    padding:30px 20px
}
</style>
