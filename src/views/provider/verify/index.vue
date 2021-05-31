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
            <td>审核状态:</td>
            <td>
              <el-select v-model="searchParam.verifyStatus" placeholder="请选择分类">
                <el-option
                  v-for="item in verifyStatusList "
                  :key="item.id"
                  :value-key="item.text"
                  :label="item.text"
                  :value="item.id"
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >

            <el-table-column prop="provinceName" label="服务商名称" width="150px" />
            <el-table-column prop="mobileNo" label="手机号码" width="150px" />
            <el-table-column prop="provinceNo" label="服务商编号" width="150px" />
            <el-table-column prop="bankName" label="银行名称" width="150px" />
            <el-table-column prop="cardNo" label="银行卡号" width="150px" />
            <el-table-column prop="provinceRoleText" label="服务商等级" width="150px" />
            <el-table-column prop="verifyStatusText" label="审核状态" width="150px" />
            <el-table-column prop="provinceRole" label="门店状态" width="150px">
              <template slot-scope="scope">
                <span>{{ scope.row.shopStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">

                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="addOrEdit('view',scope.$index, tableData)"
                >
                  查看
                </el-button>
                <el-button
                  v-show="scope.row.verifyStatus == 20"
                  type="text"
                  size="small"
                  @click.native.prevent="submitVerify(scope.row)"
                >
                  审核
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

    <el-dialog title="审核" :visible.sync="showVerify">
      <el-form :model="verifyForm">
        <el-input v-show="false" v-model="verifyForm.providerId" />
        <el-form-item label="审核结果" label-width="80">
          <el-radio v-model="verifyForm.verifyStatus" label="30" @change="changeVerifyStatus">审核通过</el-radio>
          <el-radio v-model="verifyForm.verifyStatus" label="21" @change="changeVerifyStatus">审核不通过</el-radio>
        </el-form-item>
        <el-form-item v-show="showReason" label="审核意见" label-width="80">
          <el-input
            v-model="verifyForm.rejectReson"
            type="textarea"
            :rows="2"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitVerifyReason()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import saveOrEdit from '../join/saveOrEdit'
import { getMethod, postMethod } from '@/api/request'

export default {
  components: { },
  data() {
    return {
      showReason: false,
      showVerify: false,
      verifyForm: {
        rejectReson: '',
        verifyStatus: '30',
        providerId: ''
      },
      verifyStatusList: [{
        id: '20,21,30',
        text: '全部'
      }, {
        id: '20',
        text: '待审核'
      }, {
        id: '21',
        text: '未通过'
      }, {
        id: '30',
        text: '已通过'
      }],
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
        verifyStatus: '20,21,30',
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
    // showVerify = false
    submitVerifyReason() {
      this.showVerify = false
      postMethod('/backend/lyProviderReject/save', this.verifyForm).then(res => {
        this.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    changeVerifyStatus(val) {
      if (val == '30') {
        this.showReason = false
        this.verifyForm.reason = ''
      } else {
        this.showReason = true
      }
    },
    submitVerify(rowData) {
      this.showVerify = true
      this.verifyForm.providerId = rowData.id
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
      this.searchParam
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
