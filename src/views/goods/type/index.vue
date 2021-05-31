<template>
  <div>
    <div v-if="showList" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>分类名称:</td>
            <td><el-input v-model="searchParam.typeName" width="180px" /></td>
            <td>
              <el-button icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button plain type="primary" icon="el-icon-document-add" @click="addOrEdit('add')">新建</el-button>
              <el-button plain type="warning" icon="el-icon-delete" @click="batchDeleteRow()">批量删除</el-button>
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
            :tree-props="{childList: 'childList', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              type="selection"
              width="55"
            />

            <el-table-column
              prop="typeName"
              label="分类名称"
              width="300px">
               <template slot-scope="scope">
                  <span>
                    {{scope.row.typeName}} 
                    <el-button type="primary" v-if="scope.row.parentId == -1" @click="addOrEdit('appendLevel',scope.$index,scope.row)" icon="el-icon-plus" circle></el-button>
                  </span>
               </template>
            </el-table-column>
            <el-table-column
              prop="typeLabel"
              label="标签名称"
              width="220px"
            />

            <el-table-column
              prop="isShow"
              label="是否显示"
              width="200px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.show?'显示':'不显示' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="sort"
              label="排序"
              width="180px"
            />

            <el-table-column
              prop="id"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                >
                  删除
                </el-button>
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
        pageSize: 15,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  computed: {
  },
  mounted() {
    this.initLoad()
  },
  created() {
  },
  methods: {
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
      postMethod('/backend/goodType/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
      })
      this.searchParam.pageSize = 15
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/backend/goodType/findList', param).then(res => {
          scope.editData = res.data[0]
          this.showList = false
          this.showAddOrEdit = true
        })
      } else if(oper == 'appendLevel'){
          scope.editData = {
            parentId:data.id
          }
          this.showList = false
          this.showAddOrEdit = true
      }else {
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
      getMethod('/backend/goodType/findPage', this.searchParam).then(res => {
        scope.tableData = res.data
        scope.showPagination = scope.tableData.total == 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container{
    padding:10px 20px;
    font-size: 14px;
    .ly-tool-panel {
        div{
            display: inline;
        }
        line-height: '60px';
        height: '60px';
        width: 100%;
        padding: 10px 10px;
        .ly-tool-btn{
            padding-left:20px;
            display:inline;
        }
    }
}
</style>
