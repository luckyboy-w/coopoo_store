<template>
  <div>
    <div>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="24">
          <el-button type="primary" size="small" icon="el-icon-back" @click="backToList()">返回列表</el-button>
        </el-col>
      </el-row>
        <el-row :gutter="20" style="line-height:60px;font-size:14px;background-color:#FFFFF0">
            <el-col :span="6">
              <div>订单编号：{{ ordDtl.orderNo }}</div>
            </el-col>
            <el-col :span="6">
              <div>订单状态：{{ ordDtl.orderStatus | statuts2Text }}</div>
            </el-col>
            <el-col :span="6" />
            <el-col :span="6" />
          </el-row>
          <div style="padding:10px;margin:10px 0px 10px 0;">
            <el-row :gutter="20">
              <el-table :data="ordDtl.orderItemList" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}" border>
                <el-table-column prop="goodsImage" label="商品图片">
                  <template slot-scope="scope">
                    <img :src="scope.row.goodsImage" height="40px" width="40px">
                  </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" />
                <el-table-column prop="skuText" label="规格">
                  <template slot-scope="scope">
                    {{ scope.row.skuText }}
                    <div v-if="ordDtl.orderStatus==5||ordDtl.orderStatus==6" style="text-align: center!important;width: 100%;">
                      <el-button type="text" @click="modifySku(scope.row)">修改订单属性</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="goodsPrice" label="商品单价" />
                <el-table-column prop="goodsNum" label="商品数量" width="100px" />
                <el-table-column label="商品总价">
                  <template slot-scope="scope">
                    {{ scope.row.goodsPrice * scope.row.goodsNum }}
                  </template>
                </el-table-column>
                <el-table-column prop="goodsCode" label="物料编码" />
              </el-table>
            </el-row>
          </div>

          <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
            <el-row :gutter="20" style="line-height:40px;" class="main-title">
              <el-col :span="24">
                付款信息
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col :span="6">
                付款方式：{{ ordDtl.payChannel | pay2Text }}
              </el-col>
              <el-col :span="6">
                订单金额：{{ ordDtl.orderAmount }}
              </el-col>
              <el-col :span="6">
                应付金额：{{ ordDtl.orderActualPayAmount }}
              </el-col>
              <el-col :span="6">
                第三方支付：{{ ordDtl.orderPayAmount }}
              </el-col>
            </el-row>
			<el-row :gutter="20" class="main-text">
			  <el-col :span="6">
			    优惠券金额：{{ ordDtl.couponFaceValue }}
			  </el-col>
			  <el-col :span="6">
			    余额：{{ ordDtl.balance }}
			  </el-col>
			  <el-col :span="6">
			    专属折扣：{{ ordDtl.discountAmount?ordDtl.discountAmount:'0' }}
			  </el-col>
			</el-row>
          </div>

          <div v-if="ordDtl.deliveryMethod==1"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
            <el-row :gutter="20" style="line-height:40px" class="main-title">
              <el-col :span="6">
                收货人信息
                <el-button v-if="ordDtl.orderStatus==6" type="text" @click="addressDialog = true">&nbsp;&nbsp;&nbsp; 修改收货地址</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col :span="6">
                收货人：{{ ordDtl.receiverName }}
              </el-col>
              <el-col :span="6">
                收货人电话：{{ ordDtl.receiverPhone }}
              </el-col>
              <el-col :span="6">
                收货地址：{{ ordDtl.receiverAddress }}
              </el-col>
            </el-row>
          </div>
          <div v-if="ordDtl.deliveryMethod==2"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px;">
            <el-row :gutter="20" style="line-height:40px" class="main-title">
              <el-col :span="6">
                提货信息
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col :span="6">
                预约时间：{{ ordDtl.appointmentDate }}
              </el-col>
              <el-col :span="6">
                预留手机号：{{ ordDtl.appointmentMobile }}
              </el-col>
              <el-col :span="6">
                取件门店：{{ ordDtl.memberStoreName }}
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col :span="6">核销时间：{{ ordDtl.exchangeDate }}</el-col>
            </el-row>
          </div>
          <div v-if="ordDtl.receiptId"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);padding:10px;margin:10px 0px 10px 0;">
            <el-row :gutter="20" style="line-height:40px" class="main-title">
              <el-col :span="24">
                发票信息
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col :span="6">
                发票抬头：{{ ordDtl.receiptTitle == '1' ? '公司' : '个人' }}
              </el-col>
              <el-col :span="6">
                手机号：{{ordDtl.receiptMobile}}
              </el-col>
              <el-col :span="6">
                邮箱：{{ ordDtl.receiptEmail }}
              </el-col>
              <el-col :span="6">
                发票内容：{{ ordDtl.receiptContent }}
              </el-col>
            </el-row>
            <el-row :gutter="20" class="main-text">
              <el-col v-if="ordDtl.receiptTitle=='1'" :span="6">
                公司名称：{{ ordDtl.receiptCompanyName }}
              </el-col>
              <el-col v-if="ordDtl.receiptTitle=='2'" :span="6">
                发票人名称：{{ ordDtl.receiptPersonName }}
              </el-col>
              <el-col v-if="ordDtl.receiptTitle=='1'" :span="6">
                税号：{{ ordDtl.receiptCompanyTaxNo }}
              </el-col>
              <el-col :span="6" />
              <el-col :span="6" />
            </el-row>
          </div>
          <div style="width: 100%;display: flex;">
            <div style="width: 60%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
           padding:10px;margin:10px 15px 10px 0;">

              <el-carousel v-if="ordDtl.expressRouteInfoList&&ordDtl.expressRouteInfoList.length>=1" trigger="click"
                style="padding-bottom: 30px;">
                <el-carousel-item v-for="expressItem in ordDtl.expressRouteInfoList">
                  <el-row :gutter="20" style="line-height:40px" class="main-title">
                    <el-col v-if="expressItem.type==1" :span="18">
                      发货物流
                    </el-col>
                    <el-col v-if="expressItem.type==2" :span="18">
                      退货物流
                    </el-col>
                    <el-col :span="6">
                      共{{ordDtl.expressRouteInfoList.length}}条
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" class="main-text">
                    <el-col :span="8">
                      物流公司：{{ expressItem.expressCompanyName }}
                    </el-col>
                    <el-col :span="10">
                      快递单号：{{ expressItem.logisticCode }}
                    </el-col>
                  </el-row>
                  <div>
                    <div v-if="!expressItem.traces||expressItem.traces==null">
                      物流单号错误
                    </div>
                    <div class="steps-view" v-if="expressItem.traces&&expressItem.traces!=null">
                      <div class="steps" v-for="tracesItem in expressItem.traces">
                        <div style="min-width: 100px;text-align: right;">
                          <div>{{ tracesItem.time1 }}</div>
                          <div>{{ tracesItem.time2 }}</div>
                        </div>
                        <div class="steps-node"></div>
                        <div>
                          <div>{{ tracesItem.text }}</div>
                          <div>{{ tracesItem.acceptStation }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
              <el-row :gutter="20" v-if="!ordDtl.expressRouteInfoList||ordDtl.expressRouteInfoList.length==0"
                style="line-height:40px" class="main-title">
                <el-col :span="24">
                  物流信息
                </el-col>
              </el-row>
              <div v-if="!ordDtl.expressRouteInfoList||ordDtl.expressRouteInfoList.length==0">
                暂无物流信息
              </div>

            </div>
            <div style="width: 40%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
           padding:10px;margin:10px 0px 10px 0;">
              <el-row :gutter="20" style="line-height:40px" class="main-title">
                <el-col :span="24">
                  备注
                </el-col>
              </el-row>
              <div>
                {{ordDtl.remark?ordDtl.remark:'暂无备注'}}
              </div>
            </div>
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
  import {
    getToken
  } from '@/utils/auth.js'
  export default {
    components: {},
    filters: {
      pay2Text(pay) {
        if (pay == 1) {
          return '支付宝'
        } else if (pay == 2) {
          return '微信'
        } else if (pay == 3) {
          return '余额'
        }
        return '未支付'
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
    },
    data() {
      return {
        showOrdDtl: false,
        //物流轨迹信息数组
        logisticsList: [],
        showPagination: false,
        ordDtl:{},
      }
    },
    computed: {
    },
    props: {
      orderNo: {
        type: String,
        required: false,
        default: null
      }
    },
    mounted() {
      console.log(this.orderNo)
      this.initLoad()
    },
    created() {},
    methods: {
      backToList() {
        this.$emit("backToDetail");
      },
       initLoad() {
       let param = {
           orderNo: this.orderNo
         }
         getMethod('/order/goods-order-detail', param).then(res => {
           this.showOrdDtl = true
           if (res.data.expressRouteInfoList && res.data.expressRouteInfoList.length >= 1) {
             res.data.expressRouteInfoList.forEach(item => {
               let arr = []
               let text = ''
               let title = ''
               let status
               item.traces.map(tracesItem => {
                 if (tracesItem.acceptTime) {
                   arr = tracesItem.acceptTime.split(" ")
                 }
                 tracesItem.time1 = arr[0].substring(0, 10)
                 tracesItem.time2 = arr[1].substring(0, 8)
                 status = tracesItem.action
                 if (status == 0) {
                   tracesItem.text = '暂无轨迹信息';
                 } else if (status == '1') {
                   tracesItem.text = '已揽收';
                 } else if (status == '2') {
                   tracesItem.text = '运输中';
                 } else if (status == 201) {
                   tracesItem.text = '到达派件城市';
                 } else if (status == 202) {
                   tracesItem.text = '派件中';
                 } else if (status == 211) {
                   tracesItem.text = '已放入快递柜或驿站';
                 } else if (status == 3) {
                   tracesItem.text = '已签收';
                 } else if (status == 301) {
                   tracesItem.text = '已签收';
                 } else if (status == 302) {
                   tracesItem.text = '派件异常后最终签收';
                 } else if (status == 304) {
                   tracesItem.text = '代收签收';
                 } else if (status == 311) {
                   tracesItem.text = '快递柜或驿站签收';
                 } else if (status == 4) {
                   tracesItem.text = '问题件';
                 } else if (status == 401) {
                   tracesItem.text = '发货无信息';
                 } else if (status == 402) {
                   tracesItem.text = '超时未签收';
                 } else if (status == 403) {
                   tracesItem.text = '超时未更新';
                 } else if (status == 404) {
                   tracesItem.text = '拒收（退件）';
                 } else if (status == 405) {
                   tracesItem.text = '派件异常';
                 } else if (status == 406) {
                   tracesItem.text = '退货签收';
                 } else if (status == 407) {
                   tracesItem.text = '退货未签收';
                 } else if (status == 412) {
                   tracesItem.text = '快递柜或驿站超时未取';
                 } else if (status == '001') {
                   tracesItem.text = '已下单';
                 } else if (status == '002') {
                   tracesItem.text = '已发货';
                 }
               })
             })
           }
           this.ordDtl = res.data
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
