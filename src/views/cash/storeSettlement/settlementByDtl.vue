<template>
  <div style="width:100%">
    <div class="ly-tool-panel">
      <el-button type="normal" @click="backToList()">
        返回列表
      </el-button>
    </div>
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <div class="tabTd">
        <div>订单编号：</div>
        <div>
          <el-input v-model="searchParam.orderNo" placeholder="请输入" width="180px" />
        </div>
      </div>
      <!-- <div class="tabTd">
        <div>结算时间：</div>
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
        <!-- <el-button @click="exportData()" type="primary">
            导出Excel
          </el-button> -->
      </div>
    </div>
    <div class="ly-tool-panel">
      <div class="tabTd">
        结算单号：{{ settleNo }}
      </div>
    </div>
    <el-table ref="dtlTable" border :data="dataList.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
      <!-- <el-table-column type="index" width="50" label="序号" /> -->
      <el-table-column prop="orderNo" label="订单编号" />
      <!-- <el-table-column prop="settleDate" label="结算时间"/> -->
      <el-table-column prop="accountTime" label="入账时间">
        <template slot-scope="scope">
          {{ scope.row.accountTime }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          {{ scope.row.goodsName }}
          <el-tag v-if="scope.row.isVipOrder==1" effect="light" style="color: white;background-color: #409EFF;" size="mini">
            专属
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryMethod" label="配送方式">
        <template slot-scope="scope">
          <span v-if="scope.row.deliveryMethod==1">邮寄</span>
          <span v-if="scope.row.deliveryMethod==2">自提</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsNum" label="数量" />
      <el-table-column prop="goodsPrice" label="商品单价" />
      <el-table-column prop="orderAmount" label="订单金额">
        <template slot-scope="scope">
          {{ scope.row.orderAmount | fmtFee }}
        </template>
      </el-table-column>
      <el-table-column prop="orderPayAmount" label="支付金额">
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
      <el-table-column prop="writeOffTime" label="核销时间" />
      <el-table-column prop="platformServiceAmount" label="服务金额">
        <template slot-scope="scope">
          {{ scope.row.platformServiceAmount | fmtFee }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="dataList.total"
      background
      layout="prev, pager, next"
      @current-change="currentPage"
      @prev-click="currentPage"
      @next-click="currentPage"
    />
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
import { getToken } from '@/utils/auth'

export default {
  filters: {
    _formateDate(time) {
      if (time == undefined) {
        return ''
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
    detailData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      billType: '',
      billMem: '',
      tenantId: '',
      tabIndex: 0,
      // 10:未结算;20:结算中;30:已结算
      searchParam: {
        settleStatus: 3,
        orderNo: '',
        settleNo: '',
        accountDate: '',
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      settleNo: '',
      dataList: {
        list: []
      }
    }
  },
  mounted() {
    console.log(this.detailData)
    this.searchParam.settleNo = this.detailData.settleNo
    this.settleNo = this.detailData.settleNo
    this.loadList()
  },
  methods: {
    // 未结算
    loadList() {
      getMethod('/settlement/wait-list', this.searchParam).then(res => {
        const scope = this
        scope.dataList.list = res.data.records
        scope.dataList.total = res.data.total
        scope.showPagination = scope.dataList.total == 0
        console.log(scope.dataList, '8888')
      })
    },
    search(val) {
      this.searchParam.pageNum = 1
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    exportData(val) {
      console.log(val)
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      const param = {
        billNo: this.searchParam.billNo,
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        billMem: this.billMem,
        billType: this.billType
      }
      console.log(param, 'param')
      const exportParam = []
      for (const key in param) {
        exportParam.push(key + '=' + param[key])
      }
      exportParam.push('token=' + getToken())
      window.open(process.env.VUE_APP_BASE_API + '/backend/orderBill/exportDtl?' + exportParam.join('&'))
    },
    exportData_() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      const param = {
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        billMem: this.billMem,
        tenantId: this.tenantId
      }
      console.log(param, 'param')
      const exportParam = []
      for (const key in param) {
        exportParam.push(key + '=' + param[key])
      }
      exportParam.push('token=' + getToken())
      window.open(process.env.VUE_APP_BASE_API + '/backend/orderBill/exportWaitingDtl?' + exportParam.join('&'))
    },
    backToList() {
      this.$emit('backToList')
    }
  }
}
</script>
<style>
  .tabTd {
     display: flex;
     flex-wrap: nowrap;
     margin: 7px 10px;
     align-items: center;

   }
</style>
