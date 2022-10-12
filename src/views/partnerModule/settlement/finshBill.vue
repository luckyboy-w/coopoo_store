<template>
  <div>
    <div v-if="showList">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>结算单号：</div>
          <div><el-input v-model="searchParam.settleNo" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <div>入账月份：</div>
          <div><el-date-picker v-model="searchParam.accountDate" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker></div>
        </div>
        <div class="tabTd"><el-button @click="search()" type="primary">查询</el-button></div>
      </div>
      <el-table border ref="settledData" :data="settledData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <el-table-column prop="settleNo" label="结算单号" />
        <el-table-column prop="accountDate" label="入账月份" />
        <el-table-column prop="orderAmount" label="订单金额" />
        <el-table-column prop="payAmount" label="实付金额" />
        <el-table-column prop="partnerSettleAmount" label="合伙人佣金" />
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="findBillDtl(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="settledData.total"
        background
        layout="prev, pager, next"
        @current-change="currentPage"
        @prev-click="currentPage"
        :current-page="searchParam.pageNum"
        @next-click="currentPage"
      />
    </div>
    <billDetail v-if="!showList" ref="billDetail" :detail-data="detailData" @backToList="backToList" />
  </div>
</template>
<script>
import { getMethod, postMethod } from '@/api/request';
import { formatDate } from '@/api/tools.js';
import billDetail from './finishDtl';
import { getToken } from '@/utils/auth';

export default {
  components: {
    billDetail
  },
  data() {
    return {
      showList: true,
      detailData: {},
      searchParam: {
        accountDate:'',
        settleNo:'',
        pageSize: 10,
        pageNum: 1
      },
      settledData: {
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
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    findBillDtl(row) {
      let scope = this;
      scope.detailData = {
        partnerId: row.partnerId
      };
      scope.showList = false;
    },
    backToList() {
      this.showList = true;
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    loadList() {
      let scope = this;
      let param = {
        settled:scope.searchParam,
        settleStatus:2
      }
      postMethod('/settlement/partner/list', param).then(res => {
       scope.settledData.list = res.data.settledList.records;
       scope.settledData.total = res.data.settledList.total;
       scope.showPagination = scope.settledData.total == 0;
      });
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
