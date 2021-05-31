<template>
  <div>
    <table>
      <tr>
        <td style="width:120px">
          <el-select
            v-model="roleValue"
            placeholder="请选择角色"
            @change="loadRoleMenu($event,scope)"
          >
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :value-key="id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </td>
        <td>
          <el-input
            v-model="newRoleName"
            placeholder="请输入角色名称"
            clearable
          />
        </td>
        <td>  <el-button @click="saveRole()">新增角色</el-button> <el-button @click="delPermission()">刪除角色</el-button> </td>
        <td />
      </tr>
      <tr>
        <td colspan="4">
          <el-table
            :data="roleMenuData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
          >
            <el-table-column
              prop="name"
              label="模块名称"
              width="230"
            />
            <el-table-column
              prop="sort"
              label="显示顺序"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" controls-position="right" style="width: 100px" class="inputClass" />
              </template>
            </el-table-column>
            <el-table-column
              prop="access"
              label="访问权限"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-if="scope.row.children.length == 0 && scope.row.parentId != -1"
                  v-model="scope.row.access"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeAccess(scope.row,scope.row.access)"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="oper"
              label="操作权限"
              width="480"
            >
              <!-- <template slot-scope="roleScope">
                <el-checkbox v-model="checked" >选项1</el-checkbox>
              </template> -->
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr>
        <td><el-button @click="saveMenuRole()">保存</el-button> </td>
        <td />
        <td />
        <td />
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
      checked: false,
      expandData: [1, 4, 9, 10],
      checkData: [1, 4, 9],
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
  computed: {
  },
  mounted() {
    this.loadRole()
    this.loadMenu()
  },
  created() { },
  methods: {
    loadRole() {
      const scope = this

      getMethod('/backend/role/getRole', '').then(res => {
        scope.roleData = res.data
      })
    },
    changeAccess(row, access) {
      this.roleMenuData[0].access = true
    },
    loadRoleMenu() {
      const scope = this
      const param = {
        id: this.roleValue
      }
      getMethod('/backend/menu/getRoleMenu', param).then(res => {
        const returnData = res.data
        if (returnData != null) {
          this.existRoleMenuId = []
          const roleMenuList = returnData.roleMenu
          for (let i = 0; i < roleMenuList.length; i++) {
            this.existRoleMenuId.push(roleMenuList[i].mid)
          }
          this.roleMenuData = returnData.menuList
          this.evalAccess(roleMenuData)
        }
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
      const selectMenu = []
      const childList = []
      treeChildToList(this.roleMenuData, childList)
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].access) {
          selectMenu.push(childList[i].id)
        }
      }

      const param = {
        mids: selectMenu.join(','),
        rid: this.roleValue
      }
      postMethod('/backend/role/saveRoleMenu', param).then(res => {

      })
    },
    saveRole() {
      const scope = this
      if (this.newRoleName == '') {
        this.$message.error('角色名称不能为空')
        return
      }
      const param = {
        roleName: this.newRoleName
      }

      postMethod('/backend/role/saveRole', param).then(res => {
        scope.loadRole()
      })
    },
    delPermission() {
      const scope = this
      const param = {
        id: this.permissionValue
      }
      postMethod('/backend/permission/delPermission', param).then(res => {
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
.permission-title{
  float:left;
}
.permission-detail {
  float:left;
}
</style>
