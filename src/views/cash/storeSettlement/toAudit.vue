<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>结算单号：</div>
          <div>
            <el-input v-model="searchParam.settleNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <!-- <div class="tabTd">
          <div>申请时间：</div>
          <div>
            <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" />
             &nbsp;&nbsp;至&nbsp;&nbsp;
             <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" />
          </div>
        </div> -->
        <div class="tabTd">
          <div>入账月份：</div>
          <div>
            <el-date-picker
              v-model="searchParam.accountDate"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
            />
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" @click="search()">
            搜索
          </el-button>
        </div>
      </div>
      <el-table ref="noBillData" border :data="noBillData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <!-- <el-table-column type="index" width="50" label="序号" /> -->
        <el-table-column prop="settleNo" label="结算单号" />
        <!-- <el-table-column prop="applySettleDate" label="申请时间" /> -->
        <el-table-column prop="accountDate" label="入账月份">
          <template slot-scope="scope">
            {{ scope.row.accountDate }}
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额">
          <template slot-scope="scope">
            {{ scope.row.orderAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="orderPayAmount" label="实付金额">
          <template slot-scope="scope">
            {{ scope.row.orderPayAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="preSettleAmount" label="预计结算金额">
          <template slot-scope="scope">
            {{ scope.row.preSettleAmount | fmtFee }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="platformServiceAmount" label="平台服务费">
          <template slot-scope="scope">
            {{ scope.row.platformServiceAmount | fmtFee }}
          </template>
        </el-table-column> -->
        <el-table-column prop="commissionPrice" label="分销佣金">
          <template slot-scope="scope">
            {{ scope.row.commissionPrice | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="partnerSettleAmount" label="合伙人佣金" />
        <el-table-column prop="actualSettleAmount" label="实际结算金额">
          <template slot-scope="scope">
            {{ scope.row.actualSettleAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="findBillDtl(scope.row)">
              查看明细
            </el-link>
            <!-- <el-link type="primary" v-if="scope.row.isConfirm!=1"  @click="confirmed(scope.row)">
              确认金额
            </el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="noBillData.total"
        background
        layout="prev, pager, next"
        @current-change="currentPage"
        @prev-click="currentPage"
        @next-click="currentPage"
      />
    </div>
    <billDetail v-if="!showList" ref="billDetail" :detail-data="detailData" @backToList="backToList" />
  </div>
</template>
<script>
import {
  getMethod,
  postMethod
} from '@/api/request'
import {
  formatDate
} from '@/api/tools.js'
import billDetail from './toAuditDtl'

export default {
  components: {
    billDetail
  },
  filters: {
    _formateDate(time) {
      if (time == undefined) {
        return ''
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    fmtFee(fee) {
      if (fee == undefined) {
        return ''
      }
      fee = fee + ''
      if (fee.indexOf('.') == -1) {
        return fee + '.00'
      }
      return fee
    }
  },
  props: {

  },
  data() {
    return {
      tabIndex: 0,
      showList: true,
      detailData: {},
      // 10:未结算;20:结算中;30:已结算
      searchParam: {
        accountDate: '',
        settleNo: '',
        settleStatus: '1',
        // startTime: '',
        // endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      noBillData: {
        list: [],
        total: 0
      }
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    search() {
      this.searchParam.pageNum = '1'
      this.loadList()
    },
    backToList() {
      this.showList = true
    },
    batchBill() {
      const selData = this.$refs.noBillData.selection
      const id = []
      selData.forEach(data => {
        id.push(data.pkBillId)
      })
      this.billOrd(id.join(','))
    },
    singleBill(row) {
      this.billOrd(row.pkBillId)
    },
    confirmed(row) {
      const scope = this
      this.$confirm('是否进行确认金额操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        postMethod('/settlement/confirm?id=' + row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          scope.loadList()
        })
      })
    },
    findBillDtl(row) {
      console.log(row)
      const scope = this
      scope.detailData = {
        settleNo: row.settleNo
      }
      console.log(scope.detailData)
      scope.showList = false
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    loadList() {
      const scope = this
      const param = this.searchParam
      getMethod('/settlement/process-list', param).then(res => {
        scope.noBillData.list = res.data.records
        scope.noBillData.total = res.data.total
        scope.showPagination = scope.noBillData.total == 0
      })
    }
  }
}
</script>
<style scoped>
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
