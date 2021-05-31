<template>
  <div>
    <div v-if="showList" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>&nbsp;&nbsp;</td>
            <td>
              <!-- <el-button icon="el-icon-search" @click="search()">搜索</el-button> -->
              <el-button
                plain
                type="primary"
                icon="el-icon-document-save"
                @click="saveServiceInStore()"
              >保存服务</el-button>
              <el-button plain type="success" icon="el-icon-back" @click="backStoreIndex()">返回门店</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="dataTable"
            :data="tableData.list"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="serviceIcon" label="服务ICON" width="400px">
              <template slot-scope="scope">
                <img
                  v-for="(item,i) in scope.row.files"
                  :key="item.url"
                  width="300px"
                  height="180px"
                  :src="item.url"
                >
              </template>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务名称" width="150px" />
            <el-table-column prop="beanCost" label="兑换靠谱豆" width="120px" />
            <el-table-column prop="serviceContent" label="门店服务介绍" width="120px">
              <template slot-scope="scope">
                <p v-html="scope.row.serviceContent" />
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
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'

export default {
  components: {},
  props: {
    storeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectList: [],
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        pageSize: 100,
        pageNum: 0
      },
      saveForm: {
        storeId: [],
        serviceIds: ''
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
    saveServiceInStore() {
      const selectRow = this.$refs.dataTable.store.states.selection
      const serviceIds = []
      for (let i = 0; i < selectRow.length; i++) {
        serviceIds.push(selectRow[i].id)
      }
      const param = {
        storeId: this.storeData.id,
        serviceIds: serviceIds.join(',')
      }
      postMethod(
        '/backend/storeServiceRelation/update',
        param
      ).then(res => {})
    },
    backStoreIndex() {
      this.$emit('backToStoreIndex')
    },
    updateEnable(rowObj) {
      const param = {
        id: rowObj.id,
        enable: rowObj.enable
      }
      postMethod(
        '/backend/storeServiceRelation/updateObj',
        param
      ).then(res => {})
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/backend/storeServiceRelation/delete', param).then(
          res => {
            this.loadList()
            this.$message('删除成功')
          }
        )
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
      postMethod('/backend/storeServiceRelation/delete', param).then(
        res => {
          scope.editData = res.data[0]
          this.showList = false
          this.showAddOrEdit = true
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      )
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
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
      this.initSelectData()
    },
    loadList() {
      const scope = this
      getMethod(
        '/backend/storeServiceRule/findPage',
        this.searchParam
      ).then(res => {
        scope.tableData = res.data
        scope.showPagination = scope.tableData.total == 0
        this.$nextTick(function() {
          const dataList = scope.tableData.list
          for (let i = 0; i < dataList.length; i++) {
            if (this.selectList.indexOf(dataList[i].id) != -1) {
              this.$refs.dataTable.toggleRowSelection(dataList[i], true)
            }
          }
        })
      })
    },
    initSelectData() {
      const param = {
        storeId: this.storeData.id
      }

      getMethod('/backend/storeServiceRelation/findList', param).then(
        res => {
          const dataList = res.data

          for (let i = 0; i < dataList.length; i++) {
            this.selectList.push(dataList[i].ssrId)
          }
          this.loadList()
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
