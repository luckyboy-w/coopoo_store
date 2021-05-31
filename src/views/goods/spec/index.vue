<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>规格名称:</td>
            <td>
              <el-input @keyup.enter.native="search()" v-model="searchParam.specName" width="180px"></el-input>
            </td>
            <td>备注名称:</td>
            <td>
              <el-input @keyup.enter.native="search()" v-model="searchParam.specDescName" width="180px"></el-input>
            </td>
            <td>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button  type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
              <el-button  type="danger" @click="batchDeleteRow()" icon="el-icon-delete">批量删除</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 1400px;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="typeName" label="分类名称" width="150px"></el-table-column>
            <el-table-column prop="specName" label="规格名称" width="150px"></el-table-column>
            <el-table-column prop="specDescName" label="备注名称" width="150px"></el-table-column>
            <el-table-column prop="specValue" label="规格值" width="550px"></el-table-column>

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="addOrEdit('edit',scope.$index, tableData)"
                    size="mini" type="primary"
                  >编辑
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            background
            v-show="!showPagination"
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
            :total="tableData.total"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod } from '@/api/request'

export default {
  computed: {},
  mounted() {
    this.initLoad()
  },
  components: { saveOrEdit },
  created() {
  },
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
  methods: {
    deleteRow(row, data) {
      let param = {
        id: row.id
      }
      postMethod('/bu/goodSpec/delete', param).then(res => {
        this.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    async batchDeleteRow(rowIndex, data) {
      let selectList = this.$refs.mainTable.selection
      let idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      let param = {
        id: idArr.join(',')
      }

      await postMethod('/bu/goodSpec/delete', param)
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      let scope = this

      if (oper == 'edit') {
        let param = {
          id: data.list[rowIndex].id
        }
        getMethod('/bu/goodSpec/findObj', param).then(res => {
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
    fmtSpecValue(specList) {
      specList = specList || []
      let returnList = []
      for (let i = 0; i < specList.length; i++) {
        returnList.push(specList[i].skuText)
      }
      return returnList.join(',')
    },
    loadList() {
      let scope = this
      getMethod('/bu/goodSpec/findPage', this.searchParam).then(
        res => {
          scope.tableData = res.data
          for (let i = 0; i < scope.tableData.list.length; i++) {
            scope.tableData.list[i].specValue = scope.fmtSpecValue(scope.tableData.list[i].skuList)
          }

          scope.showPagination = scope.tableData.total == 0
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  .ly-tool-panel {
    padding: 10px 0px;
  }
}

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination > > > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}

</style>
