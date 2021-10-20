<template>
  <div>
    <div v-if="showList" class="list-panel">
      <div style="display: flex;align-items: center;margin:0 0 10px 10px;">
        姓名：
        <div>
          <el-input placeholder="请输入" v-model="searchParam.userName" clearable />
        </div>
        <div style="margin-left: 20px;">
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        </div>
      </div>
      <table>
        <tr>
          <td>
            <el-button type="primary" @click="addOrEditUser()">新增用户</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <el-table :data="userList.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
              <el-table-column label="姓名" width="180" prop="userName"></el-table-column>
              <el-table-column label="岗位" width="180" prop="workPosition"></el-table-column>
              <el-table-column label="登录账号" width="180" prop="account"></el-table-column>
              <el-table-column label="近期登录时间" width="180" prop="lastLoginTime">
                <template slot-scope="scope">
                  {{scope.row.lastLoginTime|_formatDate}}
                </template>
              </el-table-column>
              <el-table-column prop="enable" label="状态"  width="150px">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.enable" active-value="1" inactive-value="0"
                    @change="enable(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                  <el-link type="primary"  @click="editSysUser(scope.row)">编辑</el-link>
                      <el-divider direction="vertical"></el-divider>
                  <el-link type="primary" @click="resetPwd(scope.row)">修改密码</el-link>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        <tr>
          <div class="ly-data-pagination">
            <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage" :current-page="searchParam.pageNum"
              @prev-click="currentPage" @next-click="currentPage" :total="userList.total"></el-pagination>
          </div>
        </tr>
      </table>
    </div>

    <el-dialog :visible="showReset" v-if="showReset" title="密码重置" width="600px">
      <el-form ref="dataForm" :model="resetFrm" label-width="100px" style="width:500px">
        <el-form-item label="密码">
          <el-input v-model="resetFrm.password" placeholder="请输入密码" show-password clearable />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="resetFrm.reppwd" placeholder="" show-password clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReset()">提交</el-button>
          <el-button @click="cancelSubmit()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <addUser ref="addOrEditRef" v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import addUser from './add'
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    components: {
      addUser
    },
    data() {
      return {
        editData: {
          password: '',
          reppwd: '',
        },
        searchParam:{
          userName:'',
          pageNum:1,
          pageSize:10,
        },
        resetFrm: {},
        showReset: false,
        showList: true,
        showAddOrEdit: false,
        userList: {
          list:[]
        },
        userName:'',
        showPagination: false,
      }
    },
    computed: {},
    mounted() {
      this.loadUser()
    },
    filters: {
      _formatDate(time) {
        if (time == '' ||
          time == undefined) {
          return ''
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    created() {},
    methods: {
      // 条件查询
      search(){
		  this.searchParam.pageNum = 1;
        this.loadUser()
      },
      // 分页
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadUser();
      },
      submitReset() {
        if (this.resetFrm.password != this.resetFrm.reppwd) {
          this.$message({
            message: "两次输入的密码不一致",
            type: "warring"
          });
          return;
        }
        console.log(this.resetFrm,"resetFrm")
        let param= {
          id:this.resetFrm.id,
          newPwd:this.resetFrm.password
        }
        postMethod('/permission/change-password',param).then(res => {
          this.$message({
            message: "修改完成",
            type: "success"
          });
          this.showList = true
          this.showReset = false
        })
      },
      //  启用禁用
      enable(row) {
        console.log("888",row)
        let scope = this
        if (row.enable=="1") {
          postMethod('/permission/enable-account', {id:row.id}).then(res => {
            scope.loadUser()
            this.$message({
              message: "启用成功",
              type: "success"
            });
          });
        } else if(row.enable=="0"){
        postMethod('/permission/disable-account', {id:row.id}).then(res => {
          scope.loadUser()
          this.$message({
            message: "禁用成功",
            type: "success"
          });
        });
        }
      },
      cancelSubmit() {
        this.showList = true
        this.showReset = false
      },
      resetPwd(row) {
        this.showReset = true
        this.showAddOrEdit = false
        this.resetFrm={}
        this.resetFrm.id = row.id
      },
      editSysUser(row) {
		  console.log(row)
        let param = {
          id: row.id
        }
        getMethod('/permission/get-account-info', param).then(res => {
          this.showAddOrEdit = true
          this.showList = false
          this.editData = res.data
        })
      },
      addOrEditUser() {
        this.editData.id=""
        this.showList = false
        this.showAddOrEdit = true
      },
      showListPanel(isCancel) {
        this.showList = true
        this.showAddOrEdit = false
        this.loadUser()
      },
      loadUser() {
        const scope = this
        getMethod('/permission/get-account-list', this.searchParam).then(res => {
          res.data.records.forEach(i => {
            i.enable=JSON.stringify(i.enable)
          })
          scope.userList.list = res.data.records
          scope.userList.total=res.data.total
          scope.showPagination = scope.userList.total == 0;
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .list-panel {
    padding: 30px 20px
  }

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
