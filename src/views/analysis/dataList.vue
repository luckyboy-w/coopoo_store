<template>
  <div>

    <el-row :span="24" class="panel-group">
        <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
            <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">
                订单总成交金额
            </div>
               <span  class="card-panel-num">
               {{allPrice}}
              </span>
            </div>
        </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="data" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">
                订单成交总数量
            </div>
              <span  class="card-panel-num">
               {{allOrdNum}}
              </span>
            </div>
        </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">
                商品期间总销量
            </div>
              <span  class="card-panel-num">
               {{saleGoodNum}}
              </span>
            </div>
        </div>
        </el-col>
        <el-col  :span="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
            <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">
                商品期间总收藏量
            </div>
             <span  class="card-panel-num">{{favNum}}</span>
            </div>
        </div>
        </el-col>
    </el-row>
    <el-row :span="24">
        <el-col :span="24">
                <chart ref="chart1" :options="orgOptions" :label="{title:'订单统计'}" :auto-resize="true" :style="{width: '100%', height: '300px'}"></chart>
        </el-col>
    </el-row>

    <el-row :span="24">

    </el-row>

    <el-row :span="24" style="padding-top:25px">

              <el-col :span="6">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">商品销量TOP10</div>
                  <div>
                    <el-table
                            ref="settleEndData"
                            :data="bestSale"

                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="goodName" label="商品名称" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="dataCnt" label="销量" min-width="30%">
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>

            <el-col :span="6">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">销售量后10名</div>
                  <div>
                    <el-table
                            ref="settleEndData"
                            :data="worseSale"
                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="goodName" label="商品名称" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="dataCnt" label="销量" min-width="30%">
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>

            <el-col :span="6">
                <div style="padding: 0px 10px;">
                  <div class="analysis-title">收藏量TOP10</div>
                  <div>
                    <el-table
                            ref="settleEndData"
                            :data="bestFav"
                            style="width: 100%; margin-bottom: 20px;"
                            row-key="id">
                          <el-table-column prop="goodName" label="商品名称" min-width="70%">
                            </el-table-column>
                            <el-table-column prop="dataCnt" label="收藏量" min-width="30%">
                            </el-table-column>
                    </el-table>
                  </div>
                </div>
            </el-col>

            <el-col :span="6">
              <div style="padding: 0px 10px;">
                <div class="analysis-title">收藏量后10名</div>
                <div>
                  <el-table
                          ref="settleEndData"
                          :data="worseFav"
                          style="width: 100%; margin-bottom: 20px;"
                          row-key="id">
                        <el-table-column prop="goodName" label="商品名称" min-width="70%">
                          </el-table-column>
                          <el-table-column prop="dataCnt" label="收藏量" min-width="30%">
                          </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>

    </el-row>


  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import { getMethod, postMethod } from "@/api/request";
  import { formatDate } from "@/api/tools.js"

  export default {
    name:'',
    props:[''],
    data () {
      return {
          bestSale:[],
          worseSale:[],
          bestFav:[],
          worseFav:[],
          allOrdNum:0,
          allPrice:0,
          favNum:0,
          saleGoodNum:0,
          ordDtl:{
            allOrdNum:0,
            allPrice:0,
            favNum:0,
            saleGoodNum:0
          },
          orgOptions: {},
          lineDate:{
            dateList: [],
            ordListL: [],
            payList: []
          }
      };
    },
    components: {
        CountTo
    },
    computed: {},
    beforeMount() {},
    mounted() {
        this.initTopData()
        this.orgOptions = {
          title: {
            text: '订单统计'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['下单订单数据','付款订单数']
          },
          grid: {
              left: '50px',
              right: '50px',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.lineDate.dateList
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name:'下单订单数据',
                  type:'line',
                  stack: '总量',
                  data: this.lineDate.ordListL
              },
              {
                  name:'付款订单数',
                  type:'line',
                  stack: '总量',
                  data: this.lineDate.payList
              }

          ]
        };
        this.initData()
    },
    methods: {
      initTopData(){
        let scope = this;

        getMethod("/bc/analysis/findTenantList", {}).then(res => {

            let resData = res.data

            resData.forEach((rowObj) =>{

              if(rowObj.dataType == 'allSale'){
                scope.allPrice = rowObj.num
                scope.allPrice = scope.allPrice.toFixed(2)
              }else if(rowObj.dataType == 'allSaleCnt'){
                scope.allOrdNum = rowObj.num
              }else if(rowObj.dataType == 'allSaleNum'){
                scope.saleGoodNum = rowObj.num
              }else{
                scope.favNum = rowObj.num
              }
            });
        });
      },
      initData(){
        let scope = this;

        getMethod("/bc/analysis/findAnalysisList", {}).then(res => {

            let resData = res.data
            resData.forEach((rowObj) =>{
              if(rowObj.dataType == 'bestSale'){
                  scope.bestSale = rowObj.analysisList
              }else if(rowObj.dataType == 'worseSale'){
                scope.worseSale = rowObj.analysisList
              }else if(rowObj.dataType == 'bestFav'){
                scope.bestFav = rowObj.analysisList
              }else{
                scope.worseFav = rowObj.analysisList
              }
            });
        });

        getMethod("/bc/analysis/findOrdLine", {}).then(res => {

            let resData = res.data
            scope.ordDtl = resData.dtlData
            let lineData = resData.lineList;
            let ordList = lineData.createOrderList;
            let payList = lineData.payOrderList;

            for(let i = 0 ; i <ordList.length ; i++){
              scope.lineDate.dateList.push(ordList[i].createDate)
              scope.lineDate.ordListL.push(ordList[i].dataCnt)
              scope.lineDate.payList.push(payList[i].dataCnt)
            }

        });
      }
    },
    watch: {}
  }

</script>
<style lang="scss" scoped>
.analysis-title{
  font-family: 'Arial Negreta', 'Arial';
  font-size: 16px;
  color:#333333;
  text-align: center;
  line-height:45px;
  font-weight: 700;
  background: #F0F0F0;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      padding-left: 10px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
