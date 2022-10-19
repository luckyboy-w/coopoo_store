<template>
  <div style="width:100%">
    <div v-if="showDetail">
    <div class="ly-tool-panel"><el-button type="normal" @click="backToList()">返回列表</el-button></div>
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <div class="tabTd">
        <div>订单编号：</div>
        <div><el-input v-model="searchParam.orderNo" placeholder="请输入" /></div>
      </div>
      <div class="tabTd">
        <div>入账月份：</div>
        <div><el-date-picker v-model="searchParam.accountDate" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker></div>
      </div>
      <div class="tabTd">
        <el-button @click="search()" type="primary">搜索</el-button>
      </div>
    </div>
    <el-table border ref="dtlTable" :data="dataList.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
    <el-table-column prop="orderNo" label="订单编号">
      <template slot-scope="scope">
        {{scope.row.orderNo}}
        <el-tag effect="light" style="color: white;background-color: #409EFF;" size="mini" v-if="scope.row.isVipOrder==1">
          专属
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="accountDate" label="入账月份" />
    <el-table-column prop="orderAmount" label="订单金额" />
    <el-table-column prop="orderPayAmount" label="实付金额" />
    <el-table-column prop="partnerSettleAmount" label="合伙人佣金" />
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" v-if="scope.row.orderType!='M'" @click="orderDtl(scope.row)">订单详情</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
      :total="dataList.total"
      background
      layout="prev, pager, next"
      @current-change="currentPage"
      @prev-click="currentPage"
      :current-page="searchParam.pageNum"
      @next-click="currentPage"
    />
    </div>
    <orderDtl v-if="!showDetail" ref="orderDtl" :orderNo="orderNo" @backToDetail="backToDetail" />
  </div>
</template>
<script>
import { getMethod, postMethod } from '@/api/request';
import { formatDate } from '@/api/tools.js';
import { getToken } from '@/utils/auth';
import orderDtl from './orderDtl'

export default {
  components: {
    orderDtl
  },
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetail:true,
      searchParam: {
        accountDate:'',
        orderNo:'',
        settleNo:'',
        pageSize: 10,
        pageNum: 1
      },
      dataList: {
        list: []
      },
    };
  },
  mounted() {
    this.searchParam.settleNo = this.detailData.settleNo;
    this.loadList();
  },
  methods: {
    loadList() {
      let scope = this
      let param = scope.searchParam
      postMethod('/settlement/partner/item/list/settled', param).then(res => {
        scope.dataList.list = res.data.records;
        scope.dataList.total = res.data.total;
        scope.showPagination = scope.dataList.total == 0;
      });
    },
    search(val) {
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    backToList() {
      this.$emit('backToList');
    },
    orderDtl(row) {
      console.log(row)
      let scope = this
      scope.orderNo=row.orderNo
      scope.showDetail = false
    },
    backToDetail(){
      this.showDetail = true
    }
  }
};
</script>
<style>
.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;
}
</style>
