<template>
  <div>
    <div v-if="showList" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>

            <td>
              <el-button v-show="false" plain type="primary" icon="el-icon-document-add" @click="addOrEdit('add')">新建</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 1157px;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="providerLevel" label="服务商等级" width="150px" />
            <el-table-column prop="providerRate" label="返佣比列" width="150px" />
            <el-table-column prop="roleDesc" label="说明" width="500px" />
            <el-table-column prop="enable" label="状态" width="150px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enable"
                  @change="updateEnable(scope.row)"
                />
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="120px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="addOrEdit('edit',scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            v-show="!showPagination"
            background
            layout="prev, pager, next"
            :total="tableData.total"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel" />
    </div>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod } from '@/api/request'

export default {
  components: { saveOrEdit },
  data() {
    return {
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        typeName: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  computed: {},
  mounted() {
    this.initLoad()
  },
  created() {},
  methods: {
    updateEnable(rowData) {
      const scope = this
      const param = {
        id: rowData.id,
        enable: rowData.enable
      }
      postMethod('/backend/providerRole/update', param).then(
        res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          scope.loadList()
        }
      )
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      postMethod('/backend/goodType/delete', param).then(res => {
        this.loadList()
        this.$message.alert('删除成功')
      })
    },
    batchDeleteRow(rowIndex, data) {
      const selectList = this.$refs.mainTable.selection
      const idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      const param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/backend/providerRole/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message.alert('删除成功')
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, row) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: row.id
        }
        getMethod('/backend/providerRole/findList', param).then(res => {
          scope.editData = res.data[0]
          this.showList = false
          this.showAddOrEdit = true
        })
      } else {
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
      }
    },
    showListPanel(isCancel) {
      this.showList = true
      this.showAddOrEdit = false
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    initLoad() {
      this.loadList()
    },
    loadList() {
      const scope = this
      getMethod('/backend/providerRole/findPage', this.searchParam).then(
        res => {
          scope.tableData = res.data
          scope.showPagination = scope.tableData.total == 0
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
	padding: 10px 20px;
	font-size: 14px;
	.ly-tool-panel {
		div {
			display: inline;
		}
		line-height: "60px";
		height: "60px";
		width: 100%;
		padding: 10px 10px;
		.ly-tool-btn {
			padding-left: 20px;
			display: inline;
		}
	}
}
</style>
