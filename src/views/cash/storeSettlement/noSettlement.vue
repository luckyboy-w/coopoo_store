<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchParam.orderNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>入账时间：</div>
          <div>
            <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" />
             &nbsp;&nbsp;至&nbsp;&nbsp;
             <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" />
          </div>
        </div>
        <div class="tabTd">
          <el-button @click="search()" type="primary">
            搜索
          </el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportData()">
            导出
          </el-button>
        </div>
      </div>
      <el-table border ref="noBillData" :data="noBillData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <!-- <el-table-column type="index" width="50" label="序号" /> -->
        <el-table-column prop="orderNo" label="订单编号"  />
        <el-table-column prop="accountTime" label="入账时间"  />
        <el-table-column prop="goodsName" label="商品名称"  >
          <template slot-scope="scope">
            {{scope.row.goodsName}}
            <el-tag effect="light" style="color: white;background-color: #409EFF;" size="mini" v-if="scope.row.isVipOrder==1">
              专属
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryMethod" label="配送方式" >
          <template slot-scope="scope">
            <span v-if="scope.row.deliveryMethod==1">邮寄</span>
            <span v-if="scope.row.deliveryMethod==2">自提</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量"  />
        <el-table-column prop="goodsPrice" label="商品单价"  />
        <el-table-column prop="orderAmount" label="订单金额" >
          <template slot-scope="scope">
            {{ scope.row.orderAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="orderPayAmount" label="实付金额" >
          <template slot-scope="scope">
            {{ scope.row.orderPayAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="partnerSettleAmount" label="合伙人佣金" />
        <el-table-column prop="actualSettleAmount" label="门店结算金额" >
          <template slot-scope="scope">
            {{ scope.row.actualSettleAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="writeOffTime" label="核销时间"  />
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-link  v-if="scope.row.deliveryMethod&&scope.row.deliveryMethod!=null" type="primary" @click="findBillDtl(scope.row)">
              订单详情
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :total="noBillData.total" background layout="prev, pager, next" @current-change="currentPage"
        @prev-click="currentPage" @next-click="currentPage" />
    </div>
    <orderDtl v-if="!showList" ref="orderDtl" :orderNo="orderNo" @backToList="backToList" />
  </div>
</template>
<script>
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"
  import orderDtl from './orderDtl'
  import {
    getToken
  } from '@/utils/auth.js'
  export default {
    components: {
      orderDtl
    },
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      fmtFee(fee) {
        if (fee == undefined) {
          return '';
        }
        fee = fee + ''
        if (fee.indexOf(".") == -1) {
          return fee + ".00";
        }
        return fee;
      }
    },
    props: {

    },
    data() {
      return {
        tabIndex: 0,
        showList: true,
        orderNo: '',
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          settleStatus:'1',
          orderNo: '',
          startTime: '',
          endTime: '',
          pageSize: 10,
          pageNum: 1
        },
        noBillData: {
          list: [],
          total: 0
        },
      };
    },
    mounted() {
      this.loadList();
    },
    methods: {
      search() {
        this.searchParam.pageNum = '1'
        this.loadList();
      },
      findBillDtl(row) {
        console.log(row)
        let scope = this
        scope.orderNo=row.orderNo
        scope.showList = false
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      exportData() {
        let exportParam = [];

        let param = JSON.parse(JSON.stringify(this.searchParam));
        delete param.pageSize
        delete param.pageNum

        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        window.open(process.env.VUE_APP_BASE_API + '/excel/wait-list?token=' + getToken() + '&' +
          exportParam.join('&'))
      },
      backToList() {
        this.showList = true
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        getMethod("/settlement/wait-list", param).then(res => {
          scope.noBillData.list = res.data.records
          scope.noBillData.total = res.data.total;
          scope.showPagination = scope.noBillData.total == 0;
        });
      }
    }
  };
</script>
<style scoped>
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
