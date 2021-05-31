<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              评价状态
            </td>
            <td>
              <el-select v-model="searchParam.replyMsgStatus" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="2" label="已回复"></el-option>
                <el-option value="1" label="未回复"></el-option>
              </el-select>
            </td>
            <td>
              <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
          >
            <el-table-column prop="orderNo" label="订单号" width="150px"></el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="150px"></el-table-column>
            <el-table-column prop="conform" label="描述相符评价" width="150px">
              <template slot-scope="scope">
                {{ scope.row.conform | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="manner" label="服务态度评价" width="150px">
              <template slot-scope="scope">
                {{ scope.row.manner | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="efficiency" label="发货速度评价" width="150px">
              <template slot-scope="scope">
                {{ scope.row.efficiency | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="评价人" width="150px"></el-table-column>
            <el-table-column prop="replyMsgStatus" label="回复状态" width="150px">
              <template slot-scope="scope">
                {{ scope.row.replyMsgStatus | msg2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="evalContent" label="评价内容" width="150px"></el-table-column>
            <el-table-column fixed="right" prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="replyMsg(scope.row)"
                    v-if="scope.row.replyMsgStatus == 1"
                    size="mini" type="primary"
                  >回复
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
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <el-dialog title="发货信息" visible="sendEval" v-if="sendEval" :before-close="handleClose">
      <el-form ref="form" :model="replyFrm" label-width="80px">
        <el-form-item label="回复内容">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入回复信息"
            v-model="replyFrm.replyMsg"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReply()">回复</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod } from '@/api/request'

export default {
  computed: {},
  props: {
    replyMsgStatusParent: {
      type: String,
      required: false,
      default: ''
    }
  },
  // mounted() {

  // 	this.initLoad();
  // 	this.loadcityList();
  // 	this.loadprovinceList();
  // },
  filters: {
    msg2Text(status) {
      if (status == '1') {
        return '未回复'
      } else {
        return '已回复'
      }
    },
    type2Text(verifyStatus) {
      // 描述相符;1:满意;2:一般;3:不满意
      // 审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 1) {
        return '满意'
      } else if (verifyStatus == 2) {
        return '一般'
      } else {
        return '不满意'
      }
    }
  },
  components: { saveOrEdit },
  created() {
  },
  data() {
    return {
      id: this.$route.params.id,
      sendEval: false,
      rowData: {},
      cityList: [],
      provinceList: [],
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      replyFrm: {
        replyMsg: ''
      },
      searchParam: {
        replyMsgStatus: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  mounted() {
    // this.$route.params.id
    if (this.$route.query.s != '') {
      this.searchParam.replyMsgStatus = this.$route.query.s
    }
    this.initLoad()
    this.loadcityList()
    this.loadprovinceList()
  },
  methods: {
    handleClose(done) {
      this.replyFrm.replyMsg = ''
      this.sendEval = false
    },
    sendReply() {
      let scope = this
      this.rowData.replyMsg = this.replyFrm.replyMsg
      this.rowData.pkEvalId = this.rowData.id
      postMethod('/bc/order/replyEval', this.rowData).then(res => {
        this.loadList()
        this.replyFrm.replyMsg = ''
        scope.sendEval = false
      })
    },
    replyMsg(row) {
      console.log(row, '这是回复')
      this.sendEval = true
      this.rowData = row
    },
    loadcityList() {
      let scope = this
      // getMethod("/backend/areas/findCity", null).then(res => {
      // 	scope.cityList = res.data.list;
      // });
    },
    loadprovinceList() {
      let scope = this
      // getMethod("/backend/areas/findProvince", null).then(res => {
      // 	scope.provinceList = res.data.list;
      // });
    },
    cancel() {
      this.replyFrm.replyMsg = ''
      this.sendEval = false
    },
    deleteRow(rowIndex, data) {
      let param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/backend/sendAddr/delete', param).then(res => {
          this.loadList()
          this.$message('删除成功')
        })
      })
    },
    batchDeleteRow(rowIndex, data) {
      let selectList = this.$refs.mainTable.selection
      let idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      let param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/backend/sendAddr/delete', param).then(res => {
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
    addOrEdit(oper, rowIndex, data) {
      let scope = this

      if (oper == 'edit') {
        let param = {
          addrId: data.list[rowIndex].addrId
        }
        getMethod('/bc/sendAddr/findObject', param).then(res => {
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
      let scope = this
      postMethod('/bc/order/findReplyEval', this.searchParam).then(
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
