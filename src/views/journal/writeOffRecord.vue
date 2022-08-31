<template>
  <div>
    <div v-loading="loading" class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchParam.searchOrderNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>注册手机号：</div>
          <div>
            <el-input v-model="searchParam.searchRegisterPhoneNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">
            搜索
          </el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="index"
                    border>
            <el-table-column prop="orderNo" label="订单编号" />
            <el-table-column prop="registerPhoneNo" label="注册手机号" />
            <el-table-column prop="exchangeType" label="核销方式">
              <template slot-scope="scope">
                <span v-if="scope.row.exchangeType == 1">管理后台</span>
                <span v-if="scope.row.exchangeType == 2">App</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderDate" label="下单时间" />
            <el-table-column prop="exchangeDate" label="核销时间" />
            <el-table-column prop="exchangeStoreName" label="核销门店" />
            <el-table-column prop="exchangeAccount" label="核销账号" />
            <el-table-column prop="searchOrderNo" label="搜索订单编号" />
            <el-table-column prop="searchRegisterPhoneNo" label="搜索注册手机号" />
            <el-table-column prop="searchPhoneNo" label="搜索卖家手机号" />

          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :current-page="searchParam.pageNum"  :total="tableData.total" background layout="prev, pager, next"
                         @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  export default {
    components: {},
    data() {
      return {
        showPagination: false,
        loading: true,
        searchParam: {
          pageSize: 10,
          pageNum: 1,
          searchOrderNo:"",
          searchRegisterPhoneNo: "",
        },
        tableData: {
          list: []
        },
      }
    },
    computed: {},
    mounted() {
      this.initLoad()
    },
    created() {

    },
    methods: {
      search() {
        this.searchParam.pageNum = 1
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
        getMethod('/order/order-exchange-record-list', this.searchParam).then(res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.showPagination =  res.data.total == 0
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;
    }
  }
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
