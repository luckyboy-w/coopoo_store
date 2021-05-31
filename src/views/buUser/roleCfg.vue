<template>
  <div>
    <table>
      <tr>
        <td>
          <el-button @click="addRole()" type="primary" v-if="!isEdit">新增角色</el-button>
          <el-button @click="saveMenuRole()" type="primary" v-if="isEdit">{{ saveOrEditText }}</el-button>
          <el-button @click="backToList()" plain icon="el-icon-back" v-if="isEdit">返回列表</el-button>
          <!-- <el-button @click="delPermission()">刪除角色</el-button>  -->
        </td>
        <td>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="height:20px;">
          &nbsp;&nbsp;
        </td>
      </tr>
      <tr v-if="!isEdit">
        <td colspan="2">
          <el-table
            :data="roleData"
            style="width: 100%;margin-bottom: 20px;"
            :row-key="id"
            border
            default-expand-all
          >
            <el-table-column
              prop="roleName"
              label="角色名称"
              width="230"
            />
            <el-table-column
              prop="roleDesc"
              label="角色备注"
              width="230"
            />
            <el-table-column
              prop="oper"
              label="操作"
              width="480"
            >
              <template slot-scope="scope">
                <!--                <el-link type="primary"  @click="initEditRole(scope.row)" >编辑</el-link>-->
                <el-button-group>
                  <el-button size="mini" type="primary" @click="initEditRole(scope.row)">编辑</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr v-if="isEdit">
        <td colspan="2">
          <el-form label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="roleName"></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input
                type="textarea"
                :rows="2"
                v-model="roleDesc"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="80px">
            <el-form-item label="访问权限">
              <el-table
                :data="roleMenuData"
                style="width: 100%;margin-bottom: 20px;"
                :row-key="id"
                border
                default-expand-all
              >
                <el-table-column
                  prop="name"
                  label="模块名称"
                  width="230"
                />
                <el-table-column
                  prop="access"
                  label="访问权限"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isSelect"
                      active-value="1"
                      inactive-value="0"
                      @change="changeAccess($event,scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { treeChildToList } from '@/utils/util'

export default {
  data() {
    return {
      id: 'id',
      isEdit: false,
      checked: false,
      rid: '',
      roleName: '',
      roleDesc: '',
      saveOrEditText: '保存',
      expandData: [],
      checkData: [],
      roleData: [],
      roleValue: '',
      newRoleName: '',
      roleMenuData: [],
      existRoleMenuId: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {},
  mounted() {
    this.loadRole()
    this.loadMenu()
  },
  created() {
  },
  methods: {
    backToList() {
      this.isEdit = false
      this.loadRole()
      this.loadMenu()
    },
    initEditRole(row) {
      let scope = this
      this.rid = row.pkRoleId
      let param = {
        id: row.pkRoleId
      }

      getMethod('/bc/menu/getMenuByRole', param).then(res => {
        scope.roleMenuData = res.data
        this.roleName = row.roleName
        this.roleDesc = row.roleDesc
        this.isEdit = true
      })
    },
    loadRole() {
      const scope = this

      getMethod('/bc/menu/getRole', '').then(res => {
        scope.roleData = res.data
      })
    },
    changeAccess(val, row) {

      if (row.parentId != '-1') {
        if (val == 1) {
          //如果是非一級菜單被打開
          for (let rowIndex in this.roleMenuData) {
            if (this.roleMenuData[rowIndex].id == row.parentId) {
              this.roleMenuData[rowIndex].isSelect = val
              break
            }
          }
        } else {

          let parentNode = null
          //如果是非一級菜單被打開
          for (let rowIndex in this.roleMenuData) {
            if (this.roleMenuData[rowIndex].id == row.parentId) {
              //找到父节点,跳出去
              parentNode = this.roleMenuData[rowIndex]
              break
            }
          }
          let unSelectCount = false
          for (let rowIndex in parentNode.children) {
            if (parentNode.children[rowIndex].isSelect == '1') {
              unSelectCount = true
              break
            }
          }
          parentNode.isSelect = unSelectCount ? '1' : '0'
        }

      } else {
        //如果是非一級菜單被打開
        for (let childObj in row.children) {
          row.children[childObj].isSelect = val
        }
      }
    },
    loadRoleMenu() {
      const scope = this
      const param = {
        id: this.roleValue
      }
      getMethod('/bc/menu/getMenuByRole', param).then(res => {
        scope.roleMenuData = res.data
      })
    },
    evalAccess(tree) {
      for (let i = 0; i < this.roleMenuData.length; i++) {
        const menuObj = this.roleMenuData[i]
        if (menuObj.children.length == 0) {
          if (this.existRoleMenuId.indexOf(menuObj.id) != -1) {
            menuObj.access = true
          }
        } else {
          this.evalAccess(menuObj.children)
        }
      }
    },
    saveMenuRole() {
      if (this.rid != '') {
        this.editRole()
      } else {
        this.saveRole()
      }
    },
    saveRole() {
      const selectMenu = []
      const childList = []
      treeChildToList(this.roleMenuData, childList)
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].isSelect == '1') {
          selectMenu.push(childList[i].id)
        }
      }

      for (let i = 0; i < this.roleMenuData.length; i++) {
        if (this.roleMenuData[i].isSelect == '1') {
          selectMenu.push(this.roleMenuData[i].id)
        }
      }

      const param = {
        mids: selectMenu.join(','),
        rid: this.rid,
        roleName: this.roleName,
        roleDesc: this.roleDesc
      }
      postMethod('/bc/menu/saveRoleMenu', param).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.loadRole()
        this.loadMenu()
        this.isEdit = false
      })
      console.log(this.isEdit, '789787')
    },
    editRole() {
      const selectMenu = []
      const childList = []
      treeChildToList(this.roleMenuData, childList)
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].isSelect == '1') {
          selectMenu.push(childList[i].id)
        }
      }

      for (let i = 0; i < this.roleMenuData.length; i++) {
        if (this.roleMenuData[i].isSelect == '1') {
          selectMenu.push(this.roleMenuData[i].id)
        }
      }

      if (this.roleName == '') {
        this.$message({
          type: 'warning',
          message: '角色名称不能为空!'
        })
        return ''
      }
      const param = {
        mids: selectMenu.join(','),
        rid: this.rid,
        roleName: this.roleName,
        roleDesc: this.roleDesc
      }
      postMethod('/bc/menu/saveRoleMenu', param).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.loadRole()
        this.loadMenu()
        this.isEdit = false

      })
    },
    addRole() {
      let scope = this
      this.isEdit = true
      this.rid = ''
      this.roleName = ''
      this.roleDesc = ''
      getMethod('/bc/menu/getAllMenu', {}).then(res => {
        scope.roleMenuData = res.data
      })
    },
    delPermission() {
      const scope = this
      const param = {
        id: this.permissionValue
      }
      postMethod('/bc/permission/delPermission', param).then(res => {
        scope.loadRole()
        this.permissionValue = this.newPermissionValue
      })
    },
    loadMenu() {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
