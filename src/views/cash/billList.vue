<template>
  <div class="bill-tab-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-row style="line-height:40px;padding:10px 0px ">
                <el-col v-if="!isCanBill" :span="24" style="color: red">今天不是结算日</el-col>
                <el-col :span="24">{{billDate}}</el-col>
            </el-row> -->
      <el-tab-pane label="可结算" name="readyBill">
        <span slot="label" class="my-tab-label">可结算</span>
        <tr>
          <td>订单号:&nbsp;</td>
          <td>
            <el-input @keyup.enter.native="search()" v-model="searchParam.orderNo" width="180px"/>
          </td>
          <td style="padding-left:20px">入账时间:&nbsp;</td>
          <td>
            <el-date-picker v-model="searchParam.startTime" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
            </el-date-picker>
          </td>
          <td style="text-align: center;">&nbsp;&nbsp;至&nbsp;&nbsp;</td>
          <td>
            <el-date-picker v-model="searchParam.endTime" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
            </el-date-picker>
          </td>


          <td>
            <el-button type="primary" style="margin-left:20px" @click="search()">搜索</el-button>
          </td>
          <td>
            <el-button type="primary" style="margin-left:20px" @click="exportDtl()">导出Excel</el-button>
          </td>
        </tr>

        <el-table
          ref="noBillData"
          :data="noBillData.list"
          style="width: 100%; margin-bottom: 20px;"
          row-key="pkBillId"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column prop="billNo" label="流水号" min-width="24%"></el-table-column> -->
          <el-table-column prop="orderNo" label="订单号" min-width="24%">
          </el-table-column>
          <el-table-column prop="createTime" label="入账时间" min-width="24%">
            <template slot-scope="scope">
              {{ scope.row.createTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column prop="orderPrice" label="订单金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="totalAmount" label="实付金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="billMoney" label="结算金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="platformFee" label="服务金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="pkBillId" label="操作" min-width="24%">
            <template slot-scope="scope">
              <!-- <el-link v-if="isCanBill" type="primary" @click="singleBill(scope.row)">结算</el-link> -->
              <!--              <el-link type="primary" @click="showBillDetail_(scope.row)">订单明细</el-link>-->

              <el-button size="mini" type="primary" @click="showBillDetail_(scope.row)">订单明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="noBillData.total != 0"
          :total="noBillData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPage"
          @prev-click="currentPage"
          @next-click="currentPage"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>
      <el-tab-pane label="结算中" name="settleFinsh">
        <span slot="label" class="my-tab-label">结算中</span>
        <tr>
          <td>订单号:</td>
          <td>
            <el-input @keyup.enter.native="searchOne()" v-model="searchParam.orderNo" width="180px"/>
          </td>
          <td style="padding-left:20px">申请结账时间:</td>
          <td>
            <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
            </el-date-picker>

          </td>
          <td>至</td>
          <td>
            <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期">
            </el-date-picker>
          </td>
          <td>
            <el-button type="primary" style="margin-left:20px" @click="searchOne()">搜索</el-button>
          </td>
          <td style="padding-left:20px">
            <el-button type="primary" @click="exportData()">导出Excel</el-button>
          </td>
        </tr>
        <el-table ref="settleFinshData" :data="settleFinshData.list" style="width: 100%; margin-bottom: 20px;"
                  row-key="id"
        >
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="settleNo" label="结算单号" min-width="24%">
          </el-table-column>
          <el-table-column prop="applyDate" label="申请时间" min-width="24%">
            <template slot-scope="scope">
              {{ scope.row.applyDate | _formateDateWithoutSeconds }}
            </template>
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="settleAmount" label="结算金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="platformFee" label="服务金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="pkBillId" label="操作" min-width="24%">
            <template slot-scope="scope">
              <!--              <el-link type="primary" @click="showBillDetail(scope.row)"></el-link>-->
              <el-button size="mini" type="primary" @click="showBillDetail(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="settleFinshData.total != 0"
          :total="settleFinshData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPage"
          @prev-click="currentPage"
          @next-click="currentPage"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>
      <el-tab-pane label="已结算" name="settleEnd">
        <span slot="label" class="my-tab-label">已结算</span>
        <tr>
          <td>订单号:</td>
          <td>
            <el-input @keyup.enter.native="searchTwo()" v-model="searchParam.orderNo" width="180px"/>
          </td>
          <td style="padding-left:20px">结束完成时间:</td>
          <td>
            <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
            </el-date-picker>


          </td>
          <td>至</td>
          <td>
            <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期">
            </el-date-picker>
          </td>
          <td>
            <el-button type="primary" style="margin-left:20px" @click="searchTwo()">搜索</el-button>
          </td>
          <td style="padding-left:20px">
            <el-button type="primary" @click="exportData_()">导出Excel</el-button>
          </td>
        </tr>
        <el-table ref="settleEndData" :data="settleEndData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="settleNo" label="结算单号" min-width="24%">
          </el-table-column>
          <el-table-column prop="settleDate" label="入账时间" min-width="24%">
            <template slot-scope="scope">
              {{ scope.row.settleDate | _formateDateWithoutSeconds }}
            </template>
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="settleAmount" label="结算金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="platformFee" label="服务金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="pkBillId" label="操作" min-width="24%">
            <template slot-scope="scope">
              <!--              <el-link type="primary" @click="showBillDetail(scope.row)">查看明细</el-link>-->
              <el-button size="mini" type="primary" @click="showBillDetail(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="settleEndData.total != 0"
          :total="settleEndData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPage"
          @prev-click="currentPage"
          @next-click="currentPage"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>

      <el-tab-pane label="明细" name="dataDtl" v-if="dataDtl" >
        <span slot="label" class="my-tab-label">明细</span>
        <el-row style="line-height:40px;padding:10px 0px ">
          <el-col :span="24" style="padding-left:10px">
            <el-button v-if="!back_" type="primary" icon="el-icon-back" @click="backTo()">
              返回列表
            </el-button>
          </el-col>
          <table>
            <tr>
              <td v-if="this.searchParam.billType==1">入账时间</td>
              <td v-if="this.searchParam.billType==2">结算时间</td>
              <td>
                <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date"
                                placeholder="开始日期"
                />
              </td>
              <td> 至</td>
              <td>
                <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期"/>
              </td>
              <td style="padding-left: 20px;">
                <el-button @click="searchDtl()" type="primary">
                  搜索
                </el-button>
              </td>
              <td style="padding-left: 20px;">
                <el-button type="primary" @click="exportDataDtl()">导出Excel</el-button>
              </td>
            </tr>
          </table>
        </el-row>
        <el-table :data="billCashData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" min-width="24%">
          </el-table-column>
          <el-table-column v-if="this.searchParam.billType==1" prop="createTime" label="入账时间" min-width="24%">
            <template slot-scope="scope">
              {{ scope.row.createTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column v-if="this.searchParam.billType==2" prop="billTime" label="结算时间" min-width="24%">
            <template slot-scope="scope">
              {{ scope.row.billTime | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column prop="orderPrice" label="订单金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="totalAmount" label="支付金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="billMoney" label="结算金额" min-width="24%">
          </el-table-column>
          <el-table-column prop="platformFee" label="服务金额" min-width="24%">
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="billCashData.total != 0"
          :total="billCashData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPageDetail"
          @prev-click="currentPageDetail"
          @next-click="currentPageDetail"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>

    </el-tabs>

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
import {
  getToken
} from '@/utils/auth'

export default {
  data() {
    return {
      only: '',
      billMem: '',
      back_: true,
      dataDtl: false,
      dialogTableVisible: false,
      tabIndex: 0,
      billDate: '',
      isCanBill: false,
      currentGoodsSkuInfoList: [],
      //10:未结算;20:结算中;30:已结算
      searchParam: {
        orderNo: '',
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      activeName: 'readyBill',
      noBillData: {
        dataList: [],
        total: 0
      },
      billCashData: {
        dataList: [],
        total: 0
      },
      settleFinshData: {
        dataList: [],
        total: 0
      },
      settleEndData: {
        dataList: [],
        total: 0
      }
    }
  },
  filters: {
    _formateDate(time) {
      if (time == '' ||
        time == undefined) {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    _formateDateWithoutSeconds(time) {
      if (time == '' ||
        time == undefined) {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted() {
    this.loadList()
    this.loadList_()
    // this.loadBillCfgData();;
  },
  methods: {
    searchDtl() {
      let that = this
      let param = this.searchParam
      getMethod('/bu/orderBill/findBillSettledDtl', param).then(res => {
        console.log(res, '数据')
        this.billCashData = res.data
        this.billCashData.billNo = this.searchParam.billNo
      })
    },
    search() {
      let that = this
	  this.searchParam.pageNum = 1;
      let param = this.searchParam
      getMethod('/bu/orderBill/findBillDtl', param).then(res => {
        that.noBillData = res.data // 返回的数据

      })
    },
    searchOne() {
      let that = this
      this.searchParam.billType = '1'
      let param = this.searchParam
      postMethod('/bu/orderBill/findPlatApplyBill', param).then(res => {
        that.settleFinshData = res.data // 返回的数据

      })
    },
    searchTwo() {
      let that = this
      this.searchParam.billType = '2'
      let param = this.searchParam
      postMethod('/bu/orderBill/findPlatApplyBill', param).then(res => {
        that.settleEndData = res.data // 返回的数据

      })
    },
    //可结算导出
    exportDtl() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        orderNo: this.searchParam.orderNo
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportWaitingBillDtl?token=' + getToken() + '&' +
        exportParam.join('&'))
    },
    //结算中导出
    exportData() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        billType: this.searchParam.billType,
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        orderNo: this.searchParam.orderNo
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportBill?token=' + getToken() + '&' + exportParam.join(
        '&'))
    },
    //已结算导出
    exportData_() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        billType: this.searchParam.billType,
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        orderNo: this.searchParam.orderNo
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportBill?token=' + getToken() + '&' + exportParam.join(
        '&'))
    },
    //结算明细导出
    exportDataDtl() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        billNo: this.searchParam.billNo,
        billMem: this.billMem,
        billType: this.searchParam.billType
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportBillDtl?token=' + getToken() + '&' +
        exportParam.join('&'))
    },
    batchBill() {
      if (this.noBillData.total == 0) {
        this.$message({
          message: '没有需要结算的账单',
          type: 'error'
        })
        return
      }

      let selData = this.$refs.noBillData.selection
      let id = []
      selData.forEach(data => {
        id.push(data.pkBillId)
      })

      let param = {
        tenantId: this.noBillData.list[0].tenantId
      }

      if (id.length > 0) {
        param.pkBillId = id.join(',')
      }

      this.billOrd(param)
    },
    singleBill(row) {
      let scope = this

      this.$confirm('是否进行结算操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        let param = {
          pkBillId: row.pkBillId,
          tenantId: row.tenantId
        }
        scope.billOrd(param)
      })
    },
    showBillDetail_(row) {
      this.$router.push({
        path: '/bc-order/list',
        query: { ...row, openDtl: true, fromRoutePath: this.$route.path }
      })
    },
    showBillDetail(row) {
      this.dataDtl = true
      this.back_ = false
      if (this.activeName == 'settleFinsh') {
        this.only = '1'
        this.billMem = '结算中'
      } else if (this.activeName == 'settleEnd') {
        this.only = '2'
        this.billMem = '已结算'
      }
      this.activeName = 'dataDtl'
      this.searchParam.billNo = row.settleNo
      let param = this.searchParam
      getMethod('/bu/orderBill/findBillSettledDtl', param).then(res => {
        console.log(res, '数据')
        this.billCashData = res.data
        this.billCashData.billNo = this.searchParam.billNo
      })
    },
    backTo() {
      if (this.only == '1') {
        this.activeName = 'settleFinsh'
      } else if (this.only == '2') {
        this.activeName = 'settleEnd'
      }
      this.back_ = true
      this.dataDtl = false
      this.loadList_()
      this.searchParam.billNo = ''
      this.searchParam.startTime = ''
      this.searchParam.endTime = ''
    },
    // loadBillCfgData(){
    //     let scope = this
    //     getMethod("/bu/orderBill/findBillDate", {}).then(res => {
    //           let evalData = eval("("+res.data+")");
    //           if(evalData.length == 0){
    //               scope.billDate  = '暂时没有最新的结算日'
    //           }else{
    //             let now = new Date();
    //             const day = String(now.getDate()).padStart(2,'0')

    //             for (let i = 0; i < evalData.length; i++) {
    //               let compareDay = evalData[i].split("-")[2]
    //               evalData[i] = compareDay
    //               if (!this.isCanBill) {
    //                 this.isCanBill = day == compareDay
    //               }
    //             }
    //             scope.billDate  = '每月结算日是：'+evalData.join("，");
    //           }
    //     });
    // },
    billOrd(param) {
      let scope = this

      postMethod('/bu/orderBill/billOrd', param).then(res => {
        // if(res.data == '-1'){
        //     this.$message.error("结算失败，今天不是结算日");
        // }else{
        //     scope.loadList()
        // }
        this.$message({
          message: '提交结算成功,请在结算中的页签查询结算进度.',
          type: 'success'
        })
        scope.loadList()

      })
    },
    handleClick(tab, event) {
      this.tabIndex = tab.index
      if (tab.index == 0) {
        this.searchParam.billType = ''
        this.searchParam.billNo = ''
        this.back_ = true
        this.dataDtl = false
        this.searchParam.orderNo = ''
        this.searchParam.startTime = ''
        this.searchParam.endTime = ''
      } else if (tab.index == 1) {
        this.searchParam.billType = '1'
        this.searchParam.billNo = ''
        this.back_ = true
        this.dataDtl = false
        this.searchParam.orderNo = ''
        this.searchParam.startTime = ''
        this.searchParam.endTime = ''
      } else if (tab.index == 2) {
        this.searchParam.billType = '2'
        this.searchParam.billNo = ''
        this.back_ = true
        this.dataDtl = false
        this.searchParam.orderNo = ''
        this.searchParam.startTime = ''
        this.searchParam.endTime = ''
      }
      this.loadList()
      this.loadList_()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
      this.loadList_()
      this.searchDtl()

    },
    currentPageDetail(pageNum) {
      this.searchParam.pageNum = pageNum
      this.searchDtl()

    },
    loadList() {
      let scope = this
      let param = this.searchParam
      getMethod('/bu/orderBill/findBillDtl', param).then(res => {
        if (scope.tabIndex == 0) {
          scope.noBillData = res.data
        }

      })
    },
    loadList_() {
      let scope = this
      if (scope.tabIndex == 1) {
        this.searchParam.billType = '1'
        let param = this.searchParam
        postMethod('/bu/orderBill/findPlatApplyBill', param).then(res => {
          scope.settleFinshData = res.data
        })
      } else if (scope.tabIndex == 2) {
        this.searchParam.billType = '2'
        let param = this.searchParam
        postMethod('/bu/orderBill/findPlatApplyBill', param).then(res => {
          scope.settleEndData = res.data
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$table-list-height: 6vh;

.my-tab-label {
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  //color: $fontColor;
  font-size: 16px;
  padding: 0px 10px;
}

.bill-tab-list > > > .el-tabs__nav-wrap {
  overflow: hidden;
  margin-bottom: -1px;
  position: relative;
  background: $lightBGColor;
}

.bill-tab-list > > > .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
  z-index: 1;
}

.bill-tab-list > > > .el-tabs__nav-scroll {
  overflow: hidden;
  height: $table-list-height;
  padding-left: 10px;
}

.bill-tab-list > > > .el-tabs__item {
  padding: 0 20px;
  height: $table-list-height;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: $table-list-height;
  display: inline-block;
  list-style: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  //color: #939393;
  position: relative;
}
</style>
