<template>
  <div>
    <div v-if="showList" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>服务商名称:</td>
            <td>
              <el-input v-model="searchParam.provinceName" width="180px" />
            </td>
            <td>服务商等级:</td>
            <td>
              <el-select v-model="searchParam.provinceRoleList" placeholder="请选择分类">
                <el-option
                  v-for="item in provinceRoleList "
                  :key="item.id"
                  :value-key="item.providerLevel"
                  :label="item.providerLevel"
                  :value="item.id"
                />
              </el-select>
            </td>
            <td>状态:</td>
            <td>
              <el-select v-model="searchParam.enable" placeholder="请选择分类">
                <el-option
                  v-for="item in enableList "
                  :key="item.value"
                  :value-key="item.text"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">搜索</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="provinceName" label="服务商名称" width="150px" />
            <el-table-column prop="mobileNo" label="手机号码" width="150px" />
            <el-table-column prop="provinceNo" label="服务商编号" width="150px" />
            <el-table-column prop="bankName" label="银行名称" width="150px" />
            <el-table-column prop="cardNo" label="银行卡号" width="150px" />
            <el-table-column prop="provinceRoleText" label="服务商等级" width="150px" />
            <el-table-column prop="beansNum" label="靠谱豆数量" width="150px" />
            <el-table-column prop="enable" label="状态" width="150px">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enable" active-value="1" inactive-value="0" @change=" enable(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="260px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="addOrEdit('view',scope.$index, tableData)"
                >
                  查看
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
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :oper="oper" @showListPanel="showListPanel" />

    <el-dialog title="被拒原因" :visible.sync="showRejectReason" width="600px">
      <el-table :data="rejectReasonList">
        <el-table-column property="createTime" label="审批日期" width="150" />
        <el-table-column property="rejectReson" label="驳回理由" width="400" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import saveOrEdit from '../join/saveOrEdit'
import { getMethod, postMethod, formatDate } from '@/api/request'

export default {
  components: { saveOrEdit },
  data() {
    return {
      enableList: [{
        'text': '全部',
        'value': '-1'
      }, {
        'text': ' 启用',
        'value': 1
      }, {
        'text': '禁用',
        'value': 0
      }],
      showRejectReason: false,
      rejectReasonList: [],
      provinceRoleList: [],
      provinceList: [],
      cityList: [],
      showList: true,
      showAddOrEdit: false,
      oper: '',
      showPagination: false,
      editData: {},
      searchParam: {
        provinceName: '',
        provinceRole: '',
        enable: '-1',
        verifyStatus: '30',
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
    this.loadprovinceRoleList()
  },
  created() {},
  methods: {
    enable(row, v, a, c) {
      const param = {
        id: row.id,
        enable: row.enable
      }
      postMethod('/backend/lyProvider/enable', param).then(res => {
        this.loadList()
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    openRejectReason(rowData) {
      const param = {
        providerId: rowData.id
      }

      getMethod('/backend/lyProviderReject/findList', param).then(res => {
        this.rejectReasonList = res.data
        for (let i = 0; i < this.rejectReasonList.length; i++) {
          this.rejectReasonList[i].createTime = formatDate(new Date(this.rejectReasonList[i].createTime), 'yyyy-MM-dd hh:mm')
        }
      })
      this.showRejectReason = true
    },
    submitVerify(rowData) {
      this.$confirm('确定提交审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const param = {
          verifyStatus: '20',
          id: rowData.id
        }
        postMethod('/backend/lyProvider/update', param).then(res => {
          this.loadList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
      })
    },
    loadprovinceRoleList() {
      const scope = this
      getMethod('/backend/providerRole/findList', null).then(res => {
        scope.provinceRoleList = res.data
      })
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      postMethod('/backend/lyProvider/delete', param).then(res => {
        this.loadList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
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
      postMethod('/backend/lyProvider/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data, a) {
      const scope = this
      this.oper = oper
      if (oper != 'add') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/backend/lyProvider/findById', param).then(res => {
          scope.editData = res.data
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
      getMethod('/backend/lyProvider/findPage', this.searchParam).then(
        res => {
          scope.tableData = res.data
          for (let i = 0; i < scope.tableData.list.length; i++) {
            scope.formatterCol(scope.tableData.list[i])
          }
          scope.showPagination = scope.tableData.total == 0
        }
      )
    },
    formatterCol(rowData) {
      rowData.verifyStatusText = this.GLOBAL.verifyProvinceMap[rowData.verifyStatus]
      rowData.provinceRoleText = this.GLOBAL.verifyProvinceLevelMap[rowData.provinceRole]
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
