<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel" v-if="showDtl">
        <div class="tabTd">
          <div>用户昵称：</div>
          <div>
            <el-input v-model="searchParam.userName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>手机号：</div>
          <div>
            <el-input v-model="searchParam.phoneNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>会员类型：</div>
          <div>
            <el-select v-model="searchParam.accountType" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="普通会员" value="0" />
              <el-option label="门店" value="3" />
              <el-option label="专属会员" value="4" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
            <div>注册时间：</div>
            <div>
              <el-date-picker v-model="searchParam.startRegisterTime" value-format="yyyy-MM-dd" type="date"
                                placeholder="选择开始日期"
                /> &nbsp;&nbsp;至&nbsp;&nbsp;
                <el-date-picker v-model="searchParam.endRegisterTime" value-format="yyyy-MM-dd" type="date"
                                placeholder="选择结束日期"
                />
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">搜索</el-button>
          </div>
      </div>
      <div class="ly-table-panel" v-if="showDtl">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="userName" label="用户昵称"></el-table-column>
            <el-table-column prop="accountType" label="会员类型">
              <template slot-scope="scope">
                {{ scope.row.accountType | memberType}}
              </template>
            </el-table-column>
            <el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
            <el-table-column prop="orderPayAmount" label="消费金额"></el-table-column>
            <el-table-column prop="currBeanQty" label="靠谱豆" ></el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column prop="pkMemberId" label="操作" fixed="right" width="250px">
              <template slot-scope="scope">
                <el-link @click="consumeDtl(scope.row)" type="primary">消费明细</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            :current-page="searchParam.pageNum" @prev-click="currentPage" @next-click="currentPage"
            :total="tableData.total"></el-pagination>
        </div>
      </div>

      <div class="ly-tool-panel" v-if="!showDtl">
        <div class="tabTd">
          <div>商品名称：</div>
          <div>
            <el-input v-model="searchDtlParam.goodsName" placeholder="请输入" width="180px"></el-input>
          </div>
        </div>
        <div class="tabTd">
          <div>
            <el-button icon="el-icon-search" type="primary" @click="searchConsume()">搜索</el-button>
            <el-button @click="backUp()" v-if="!showDtl">返回</el-button>
          </div>
        </div>
      </div>
      <div style="padding: 0 20px 10px;" v-if="!showDtl">
        用户名称：{{memberName}}
      </div>
      <div class="ly-table-panel" v-if="!showDtl">
        <div class="ly-data-list">
          <div class="content1">
           <el-table :data="tableData2.list" border row-key="orderId" style="width: 100%">
             <el-table-column width="1">
               <template slot-scope="scope">
                 <div class="item">
                   <span style="margin-left:150px">订单编号：{{ scope.row.orderNo }}</span>
                   <span style="margin-left:150px">订单总额：{{ scope.row.orderAmount }}</span>
                   <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                   <span style="margin-left:150px">注册手机号：{{ scope.row.registerPhoneNo }}</span>
                 </div>
               </template>
             </el-table-column>
             <el-table-column label="商品" align="center" width="400">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty">
                   <div>
                     <img class="imgSty" :src="item.goodsImage" alt="">
                   </div>
                   <div class="mesFont">
                     <p>{{ item.goodsName }}</p>
                     <p style="font-size: 12px;color:#909399;margin-top: 10px;">{{ item.skuText }}</p>
                   </div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="60" label="单价">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.goodsPrice}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="60" label="数量">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{item.goodsNum}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="70" label="商品状态">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.orderItemStatus| goodsText }}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="70" label="实付金额">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.goodsPrice*item.goodsNum}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column min-width="100" align="center" label="买家">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   <div>{{ scope.row.userName }}<br />{{ scope.row.phoneNo }}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column min-width="140" align="center" label="供应商名称">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   {{ scope.row.supplierName}}
                 </div>
               </template>
             </el-table-column>
             <el-table-column label="状态" align="center" fixed="right" min-width="230">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   <template>
                     <div>
                       <div>
                         {{ scope.row.orderStatus | statuts2Text }}
                       </div>
                       <div>
                         <el-button type="text" size="mini" @click="toOrderDtl(scope.row)">订单详情
                         </el-button>
                       </div>
                       <div>
                       </div>
                     </div>
                   </template>
                 </div>
               </template>
             </el-table-column>
           </el-table>
          </div>
        </div>
        <div class="ly-data-pagination" style="margin: 15px 0;">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage_"
            :current-page="searchDtlParam.pageNum" @prev-click="currentPage_" @next-click="currentPage_"
            :total="tableData2.total"></el-pagination>
        </div>
      </div>
    </div>
    <orderDtl v-if="!showList" ref="orderDtl" :orderNo="orderNo" @backToList="backToList" />
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate
  } from "@/api/request";
  import orderDtl from '../../member/orderDtl.vue'
  export default {
    components: {
      orderDtl
    },
    computed: {},
    mounted() {
      if (this.$route.query.startRegisterTime != undefined) {
            this.searchParam.startRegisterTime = this.$route.query.startRegisterTime
            this.searchParam.endRegisterTime = this.$route.query.endRegisterTime
          }
      this.initLoad();
      // this.storeList()
    },
    created() {},
    data() {
      return {
        orderNo:'',
        tableData2: [],
        memberName: '',
        row: null,
        showDtl: true,
        showList: true,
        showPagination: false,
        searchParam: {
          accountType:'',
          endRegisterTime:'',
          startRegisterTime:'',
          phoneNo:'',
          userName:'',
          pageSize: 10,
          pageNum: 1
        },
        searchDtlParam: {
          goodsName:'',
          pageSize: 10,
          pageNum: 1
        },
        dtlTableData: [],
        tableData: [],
        dataList: [],
        changeStoreDialog: false,
        storeFrm: {},
        restaurants: [],
      };
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      memberType(data) {
        let typeText = ''
        if (data == "0") {
          typeText = "普通会员"
        } else if (data == "3") {
          typeText = "门店"
        }else if (data == "4") {
          typeText = "专属会员"
        } else if (data == "1") {
          typeText = "平台"
        }else if (data == "2") {
          typeText = "供应商"
        }
        return typeText
      },
     statuts2Text(status) {
       // 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成
       let statusText = ''
       if (status == '0') {
         statusText = '已取消'
       } else if (status == '1') {
         statusText = '已提交'
       } else if (status == '2') {
         statusText = '待支付'
       } else if (status == '3') {
         statusText = '退款中'
       } else if (status == '4') {
         statusText = '退款完成'
       } else if (status == '5') {
         statusText = '待取件'
       } else if (status == '6') {
         statusText = '待发货'
       } else if (status == '7') {
         statusText = '待收货'
       } else if (status == '8') {
         statusText = '交易完成'
       } else if (status == '9') {
         statusText = '拒收'
       } else if (status == '10') {
         statusText = '拒收完成'
       } else if (status == '11') {
         statusText = '退货中'
       } else if (status == '12') {
         statusText = '退货完成'
       } else if (status == '13') {
         statusText = '退货退款中'
       } else if (status == '14') {
         statusText = '拒收退款中'
       } else if (status == '15') {
         statusText = '待确认'
       }
       return statusText
     },
     goodsText(status) {
       // 商品状态 0:已提交 1:可退款 2:发货中 3:退款中 4:退款失败 5:退款完成 6:待评价 7:已评价 8:退货待接单 9:退货已接单 10:拒收 11:拒收完成 12:退货中 13:退货完成
       let statusText = ''
       if (status == '0') {
         statusText = '已提交'
       } else if (status == '1') {
         statusText = '可退款'
       } else if (status == '2') {
         statusText = '发货中'
       } else if (status == '3') {
         statusText = '退款中'
       } else if (status == '4') {
         statusText = '退款失败'
       } else if (status == '5') {
         statusText = '退款完成'
       } else if (status == '6') {
         statusText = '待评价'
       } else if (status == '7') {
         statusText = '已评价'
       } else if (status == '8') {
         statusText = '退货待接单'
       } else if (status == '9') {
         statusText = '退货已接单'
       } else if (status == '10') {
          statusText = '退货中'
        } else if (status == '11') {
          statusText = '退货完成'
        } else if (status == '12') {
          statusText = '拒收'
        } else if (status == '13') {
          statusText = '拒收完成'
        } else if (status == '14') {
          statusText = '退货退款中'
        } else if (status == '15') {
          statusText = '拒收退款中'
        }
       return statusText
     },
    },
    methods: {
      //跳转订单详情
      toOrderDtl(row) {
        console.log(row)
        let scope = this
        scope.orderNo=row.orderNo
        scope.showList = false
      },
      consumeDtl(row) {
        this.loadDtlList(row)
      },
      search() {
		  this.searchParam.pageNum = 1;
        this.loadList();
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      currentPage_(pageNum) {
        this.searchDtlParam.pageNum = pageNum;
        this.searchConsume();
      },
      initLoad() {
        this.loadList();
      },
      loadList() {
        let scope = this;
        getMethod("/member/search-partner-extension-member-list", this.searchParam).then(
          res => {
            scope.tableData = res.data.records;
            scope.tableData.forEach(i => {
              i.enable = JSON.stringify(i.enable)
            })
            scope.tableData.total = res.data.total
            scope.showPagination = scope.tableData.total == 0;
          }
        );
      },
      searchConsume() {
        let that = this
        getMethod('/order/search-order-list', that.searchDtlParam).then(res => {
          this.$set(this.tableData2, 'list', res.data.records)
         // scope.tableData2.list = res.data.records
         scope.tableData2.total = res.data.total
         scope.showPagination = scope.tableData2.total == 0;
        })
      },
      backToList() {
        this.showList = true
      },
      backUp(){
        this.showDtl = true
        this.searchDtlParam.pageNum = 1
        this.loadList();
      },
      loadDtlList(row) {
        let scope = this;
        console.log(row)
        scope.searchDtlParam.memberId=row.pkMemberId
        scope.memberName=row.userName
        getMethod('/order/search-order-list', scope.searchDtlParam).then(res => {
          this.$set(this.tableData2, 'list', res.data.records)
            // scope.tableData2.list = res.data.records
            scope.tableData2.total = res.data.total
            scope.showPagination = scope.tableData2.total == 0;
            scope.showDtl = false;
        })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      display: flex;
      flex-wrap: wrap;
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

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;
  }

  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
<style scoped>
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
