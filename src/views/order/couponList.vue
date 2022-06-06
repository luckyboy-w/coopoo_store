<template>
  <div>
    <div v-loading="loading" class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchParam.orderNo" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>优惠券名称：</div>
          <div>
            <el-input v-model="searchParam.goodsName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>买家手机号：</div>
          <div>
            <el-input v-model="searchParam.mobile" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>门店名称：</div>
          <div>
            <el-input v-model="searchParam.storeName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>订单状态：</div>
          <div>
            <el-select v-model="searchParam.orderStatus" placeholder="请选择">
              <el-option value="" label="全部" />
              <el-option value="20" label="已取消" />
              <el-option value="10" label="待支付" />
              <el-option value="30" label="已支付" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>优惠券类型：</div>
          <div>
            <el-select v-model="searchParam.couponType" placeholder="请选择">
              <!-- <el-option value="" label="全部"></el-option> -->
              <!-- <el-option value="2" label="线上优惠券"></el-option> -->
              <el-option value="" label="线下优惠券"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>优惠券状态：</div>
          <div>
            <el-select v-model="searchParam.isUse" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="未核销"></el-option>
              <el-option value="1" label="已核销"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>支付方式：</div>
          <div>
            <el-select v-model="searchParam.payChannel" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="2" label="微信"></el-option>
              <el-option value="1" label="支付宝"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>下单时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.startCreateTime"
              type="date" placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.endCreateTime" type="date"
              placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <div>核销时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.startWriteOffTime"
              type="date" placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.endWriteOffTime"
              type="date" placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" type="primary" @click="search()">
            搜索
          </el-button>
          <el-button icon="el-icon-download" type="primary" @click="exportData()">
            导出
          </el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="content1">
          <el-table ref="mainTable" :data="tableData.list" border row-key="orderId" style="width: 100%">
            <el-table-column width="1">
              <template slot-scope="scope">
                <div class="item">
                  <span style="margin-left:150px">订单编号：{{ scope.row.orderNo }}</span>
                  <span style="margin-left:150px">订单总额：{{ scope.row.orderMoney}}</span>
                  <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="优惠券名称" align="center" width="400">
              <template slot-scope="scope">
                <div class="mesSty">
                  <div>
                    <img class="imgSty" :src="scope.row.images" alt="">
                  </div>
                  <div class="mesFont">
                    <p>{{ scope.row.couponName }}</p>
                    <p style="font-size: 12px;color:#909399;margin-top: 10px;">线下优惠券</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="单价">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{scope.row.orderMoney}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="70" label="优惠券状态">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{scope.row.isUse===1?'已核销':'未核销' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="70" label="实付金额">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{ scope.row.orderMoney}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" label="买家">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <div>{{ scope.row.mobile }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="140" align="center" label="门店名称">
              <template slot-scope="scope">
                <div class="mesSty2">
                  {{ scope.row.storeName?scope.row.storeName:'暂无' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" fixed="right" min-width="230">
              <template slot-scope="scope">
                <div class="mesSty2">
                  <template>
                      <div>
                        {{ scope.row.status | statutsText }}
                      </div>
                  </template>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="ly-data-pagination" style="margin: 10px 0;">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" :current-page="searchParam.pageNum" @prev-click="currentPage"
            @next-click="currentPage" />
        </div>
      </div>
    </div>


    <br>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'

  import * as requestMethod from '@/api/request'

  import {
    formatDate
  } from '@/api/tools.js'
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {},
    filters: {
      _formatDate(time) {
        if (time == undefined) {
          return '尚未支付，暂无时间'
        }
        const date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      statutsText(status) {
        let statusText = ''
        if (status == '20') {
          statusText = '已取消'
        } else if (status == '30') {
          statusText = '已支付'
        } else if (status == '10') {
          statusText = '待支付'
        }
        return statusText
      },
    },
    data() {
      return {
        loading: true,
        showPagination: false,
        searchParam: {
          couponType: "",
          endCreateTime: '',
          endWriteOffTime: '',
          goodsName: '',
          mobile: '',
          orderNo: '',
          orderStatus: '',
          payChannel: '',
          startCreateTime: '',
          startWriteOffTime: '',
          storeName: '',
          isUse:'',
          pageSize: 10,
          pageNum: 1
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
      exportData() {
        let exportParam = [];

        let param = JSON.parse(JSON.stringify(this.searchParam));
        delete param.pageSize
        delete param.pageNum

        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        exportParam.push("token=" + getToken())
        window.open(process.env.VUE_APP_BASE_API + "/excel/virtual-order-list/export?" + exportParam.join("&"));
      },
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
        // requestMethod
        getMethod('/order/virtual-order-list', this.searchParam).then(res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.showPagination = scope.tableData.total == 0
          this.loading = false
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .el-carousel__item {
    overflow-y: auto !important;
  }

  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
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

  .main-title {
    font-size: 16px;
    font-weight: 600;
  }

  .main-text {
    line-height: 40px;
    font-size: 14px;
  }
</style>
<style lang="scss">
  .el-step__title {
    font-size: 12px;
  }


  .sub-title {
    font-size: 12px;
  }

  .steps-view {
    padding: 0 20px;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }

  .steps-view::before {
    content: "";
    position: absolute;
    width: 2px;
    background-color: #d8d8d8;
    height: calc(100% - 0px);
    left: 138px;
    z-index: 2;
  }

  .steps {
    display: flex;
    min-height: 60px;
    font-size: 15px;
    line-height: 20px;
    margin-bottom: 20px;
    height: auto;
  }

  .steps-node {
    background-color: #d8d8d8;
    min-width: 18px;
    border-radius: 25px;
    height: 18px;
    margin: 0 30px 0 10px;
  }
</style>
<style lang="scss" rel="stylesheet">
  .wrap-sku {
    .product-box {
      // width: 1200px;
      display: block;
      margin: 0 auto;
    }

    .product-content {
      // margin-bottom: 100px;
    }

    .product-delcom {
      color: #323232;
      border-bottom: 1px solid #EEEEEE;
    }

    .product-footerlist {
      margin-top: 10px;
    }

    .product-footerlist li {
      border: 1px solid #606060;
      border-radius: 5px;
      color: #606060;
      text-align: center;
      padding: 5px 10px;
      float: left;
      margin-right: 20px;
      cursor: pointer;
    }

    .product-footerlist li.productActive {
      background-color: #1A1A29;
      color: #fff;
      border: 1px solid #1A1A29;
    }

    .product-footerlist li.noneActive {
      background-color: #ccc;
      opacity: 0.4;
      color: #000;
      pointer-events: none;
    }

    .price {
      height: 40px;
      line-height: 40px;
    }
  }
</style>
<style scoped>
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }

  .el-table--enable-row-transition /deep/ .cell {
    padding: 0;
  }

  .item {
    width: 100vw;
    background: #f1f1f1;
    position: absolute;
    top: 0;
    left: -55px;
    z-index: 1;
    height: 50px;
    line-height: 50px;
  }

  .imgSty {
    width: 100px;
    height: 100px;
    display: block;
    margin-left: 10px;
  }

  .mesSty {
    height: 150px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty:first-child {
    margin-top: 50px;
  }

  .mesSty:last-child {
    border-bottom: none;
  }

  .mesSty2 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1px;
    height: 150px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty2:last-child {
    border-bottom: none;
  }

  .content1>>>.el-table--border td:nth-child(2) {
    padding: 0;
  }

  .content1 /deep/ .el-table__row td:nth-child(n+3) .cell {
    position: absolute !important;
    top: 50px !important;
    width: 100%;
    text-align: center;
  }

  .content1 /deep/ .el-table__row td:nth-child(1) .cell {
    position: absolute !important;
    top: 0px !important;
    z-index: 999;
    width: 100vw;
    height: 50px;
    line-height: 50px;
  }

  .pb_sty span {
    background: #1dc8de;
    padding: 2px 8px;
    border-radius: 4px;
    color: #fff;
  }

  .mesFont p {
    text-align: left !important;
    margin-block-start: 0;
    margin-block-end: 0;
    padding: 0 10px;
  }

  .mesFont p:nth-child(2) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
