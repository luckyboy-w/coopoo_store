<template>
  <div>
    <div v-if="this.accountType == 3">
      <div class="panel-group">
        <div class="card-panel-col">
          <router-link to="/cash/toAudit">
            <div class="card-panel">
              <div class="card-left">
                <div class="card-title">结算确认</div>
                <div class="card-text">确认结算数量</div>
              </div>
              <div class="card-right"><count-to :start-val="0" :end-val="indexData.confirmSettleNum" :duration="2000" /></div>
            </div>
          </router-link>
        </div>
        <div class="card-panel-col">
          <router-link
            :to="{
              path: '/order/list',
              query: {
                orderStatus: '5'
              }
            }"
          >
            <div class="card-panel">
              <div class="card-left">
                <div class="card-title">待提货</div>
                <div class="card-text">当前待提货数</div>
              </div>
              <div class="card-right"><count-to :start-val="0" :end-val="indexData.waitPickNum" :duration="2000" /></div>
            </div>
          </router-link>
        </div>
        <div class="card-panel-col">
          <router-link to="/cash/noSettlement">
            <div class="card-panel">
              <div class="card-left">
                <div class="card-title">结算收入</div>
                <div class="card-text">当月累计收入</div>
              </div>
              <div class="card-right"><count-to :start-val="0" :end-val="indexData.settleProfit" :decimals="2" :duration="2000" /></div>
            </div>
          </router-link>
        </div>
        <div class="card-panel-col">
          <router-link
            :to="{
              path: '/order/list',
              query: {
                startCreateTime: beforeDay,
                endCreateTime: beforeDay
              }
            }"
          >
            <div class="card-panel">
              <div class="card-left">
                <div class="card-title">订单数量</div>
                <div class="card-text">昨日订单数量</div>
              </div>
              <div class="card-right"><count-to :start-val="0" :end-val="indexData.orderNum" :duration="2000" /></div>
            </div>
          </router-link>
        </div>
        <div class="card-panel-col">
          <router-link
            :to="{
              path: '/member/index',
              query: {
                startRegisterTime: beforeDay,
                endRegisterTime: beforeDay
              }
            }"
          >
            <div class="card-panel">
              <div class="card-left">
                <div class="card-title">会员数量</div>
                <div class="card-text">昨日新增会员数量</div>
              </div>
              <div class="card-right"><count-to :start-val="0" :end-val="indexData.registerMemberNum" :duration="2000" /></div>
            </div>
          </router-link>
        </div>
      </div>

      <div style="margin: 15px;display: flex;justify-content: space-between;align-items: center;">
        <div style="width: 300px;">统计时间：{{ startCountTime }} ~ {{ endCountTime }}</div>
        <div style="display: flex;align-items: center;position: relative;">
          <div @click="changeDate(1)" class="blockT" :class="dateType == 1 ? 'active' : ''" style="width: 50px;"><div>7天</div></div>
          <div @click="changeDate(2)" class="blockT" :class="dateType == 2 ? 'active' : ''" style="width: 60px;"><div>30天</div></div>
          <div @click="changeDate(3)" class="blockT" :class="dateType == 3 ? 'active' : ''" style="width: 40px;"><div>日</div></div>
          <div @click="weekOver(4)" class="blockT" :class="dateType == 4 ? 'active' : ''" style="width: 40px;"><div>周</div></div>
          <div @click="monthOver(5)" class="blockT" :class="dateType == 5 ? 'active' : ''" style="width: 40px;"><div>月</div></div>
          <div style="width: 40px;overflow: hidden;position: absolute;left: 185px;z-index: -1;">
            <el-date-picker v-model="weekValue" ref="weekDateInput" @change="changeWeek" :picker-options="weekOption" type="week" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
          <div style="width: 40px;overflow: hidden;position: absolute;left: 235px;z-index: -1;">
            <el-date-picker v-model="monthValue" ref="monthDateInput" @change="changeMonth" :picker-options="pickerOptions" type="month" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div>
      </div>

      <div class="panel-group" style="margin-left: 15px;">
        <div @click="dataType('1')" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">订单金额</div>
              <div class="card-text"><count-to :start-val="0" :end-val="orderPayMoney" :decimals="2" :duration="2000" /></div>
            </div>
            <el-radio class="card-right" v-model="radio1" label="1"><div></div></el-radio>
          </div>
          <div v-if="radio1 == 1" class="flag"></div>
        </div>
        <div @click="dataType('2')" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">订单数量</div>
              <div class="card-text"><count-to :start-val="0" :end-val="orderPayNum" :duration="2000" /></div>
            </div>
            <el-radio class="card-right" v-model="radio1" label="2"><div></div></el-radio>
          </div>
          <div v-if="radio1 == 2" class="flag"></div>
        </div>
        <div @click="dataType('3')" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">结算收入</div>
              <div class="card-text"><count-to :start-val="0" :end-val="settleMoney" :decimals="2" :duration="2000" /></div>
            </div>
            <el-radio class="card-right" v-model="radio1" label="3"><div></div></el-radio>
          </div>
          <div v-if="radio1 == 3" class="flag"></div>
        </div>
        <div @click="dataType('4')" class="card-panel-col2">
          <div class="card-panel">
            <div class="card-left">
              <div class="card-title">会员数量</div>
              <div class="card-text"><count-to :start-val="0" :end-val="registerMemberNum" :duration="2000" /></div>
            </div>
            <el-radio class="card-right" v-model="radio1" label="4"><div></div></el-radio>
          </div>
          <div v-if="radio1 == 4" class="flag"></div>
        </div>
      </div>

      <div><div id="main" style="width: 100%;height:600px;"></div></div>
    </div>
    <div v-if="this.accountType == 4"><img style="width: 100%;height: 100%;" src="../../assets/partnerIndex.png" /></div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request';
import { formatDate } from '@/api/tools.js';
import variables from '@/styles/variables.scss';
import CountTo from 'vue-count-to';
import { getMon } from '@/utils/index';
import * as echarts from 'echarts';

export default {
  name: '',
  props: [''],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let t = new Date().getDate();
          return time.getTime() > Date.now() - 8.64e7 * t;
        }
      },
      beforeDay: '',
      beforeDay_: '',
      nowDay: '',
      weekOption: this.banWeek(),
      dateType: 1,
      searchParam: {
        type: 1,
        date: ''
      },
      indexData: {
        confirmSettleNum: 0,
        orderNum: 0,
        registerMemberNum: 0,
        settleProfit: 0,
        waitPickNum: 0
      },
      endCountTime: '',
      startCountTime: '',
      orderPayMoney: 0,
      orderPayNum: 0,
      settleMoney: 0,
      registerMemberNum: 0,
      showText: [],
      orderPayNumList: [],
      orderPayMoneyList: [],
      registerMemberNumList: [],
      settleMoneyList: [],
      dayValue: '',
      weekValue: '',
      monthValue: '',
      radio1: '1'
    };
  },
  components: {
    CountTo
  },
  computed: {
    accountType() {
      return this.$store.state.user.storeUserInfo.accountType;
    }
  },
  beforeMount() {},
  mounted() {
    console.log(this.accountType);
    if (this.accountType != 4) {
      this.initDay();
      // this.initData()
      this.indexLoad();
      this.loadCharts();
    }
  },
  methods: {
    banWeek() {
      return {
        //将自然周的起始日改为周一开始
        firstDayOfWeek: 1,
        //禁止选择当前周
        disabledDate(time) {
          let day = Date.now();
          let limit = getMon(day);
          let limitTime = new Date(limit);
          return time.getTime() > limitTime.getTime() - 8.64e7;
        }
      };
    },
    initDay() {
      let day = new Date();
      let day_ = new Date();
      this.beforeDay = formatDate(new Date(day.setDate(day.getDate() - 1)), 'yyyy-MM-dd');
      this.beforeDay_ = formatDate(new Date(day_.setDate(day_.getDate() - 1)), 'yyyy-MM-dd 00:00:00');
      this.nowDay = formatDate(new Date(), 'yyyy-MM-dd 00:00:00');
    },
    // 触摸获得焦点
    weekOver(val) {
      this.dateType = val;
      this.$refs.weekDateInput.$refs.reference.$refs.input.focus();
    },
    monthOver(val) {
      this.dateType = val;
      this.$refs.monthDateInput.$refs.reference.$refs.input.focus();
    },
    changeDate(val) {
      this.weekValue = '';
      this.monthValue = '';
      this.dateType = val;
      this.searchParam = {
        type: val,
        date: ''
      };
      this.loadCharts();
    },
    changeWeek(val) {
      this.monthValue = '';
      this.weekValue = val;
      let tempDate = new Date(val);
      let beforeDate = tempDate.setDate(tempDate.getDate() + 5);
      this.searchParam = {
        type: 4,
        date: formatDate(new Date(beforeDate), 'yyyy-MM-dd')
      };
      this.loadCharts();
    },
    changeMonth(val) {
      this.weekValue = '';
      this.monthValue = val;
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = new Date(year, month, 0);
      this.searchParam = {
        type: 5,
        date: year + '-' + month + '-' + day.getDate()
      };
      this.loadCharts();
    },
    dataType(val) {
      this.radio1 = val;
      if (val == '1') {
        let chartsData = {
          name: '订单金额',
          dataList: this.orderPayMoneyList
        };
        this.chartData(chartsData);
      }
      if (val == '2') {
        let chartsData = {
          name: '订单数量',
          dataList: this.orderPayNumList
        };
        this.chartData(chartsData);
      }
      if (val == '3') {
        let chartsData = {
          name: '结算收入',
          dataList: this.settleMoneyList
        };
        this.chartData(chartsData);
      }
      if (val == '4') {
        let chartsData = {
          name: '会员数量',
          dataList: this.registerMemberNumList
        };
        this.chartData(chartsData);
      }
    },
    indexLoad() {
      getMethod('/home/get-home-count', {}).then(res => {
        this.indexData = res.data;
      });
    },
    loadCharts() {
      getMethod('/home/get-home-count-chart', this.searchParam).then(res => {
        this.startCountTime = res.data.startCountTime;
        this.endCountTime = res.data.endCountTime;
        this.orderPayMoney = res.data.orderPayMoney;
        this.orderPayNum = res.data.orderPayNum;
        this.registerMemberNum = res.data.registerMemberNum;
        this.settleMoney = res.data.settleMoney;
        this.showText = [];
        this.orderPayNumList = [];
        this.orderPayMoneyList = [];
        this.registerMemberNumList = [];
        this.settleMoneyList = [];
        res.data.staticDataList.forEach(item => {
          this.showText.push(item.showText);
          this.orderPayNumList.push(item.orderPayNum);
          this.orderPayMoneyList.push(item.orderPayMoney);
          this.registerMemberNumList.push(item.registerMemberNum);
          this.settleMoneyList.push(item.settleMoney);
        });
        this.dataType(this.radio1);
      });
    },
    chartData(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: data.name
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [data.name]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.showText
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: data.name,
            type: 'line',
            data: data.dataList
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.active {
  background-color: #a49e83 !important;
  color: white !important;
}

.flag {
  width: 198px;
  border: 2px solid #a49e83;
  background-color: #a49e83;
  position: absolute;
  margin-top: -4px;
}

.el-input--medium .el-input__inner {
  height: 40px;
  line-height: 40px;
  padding: 0 !important;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 25px;
}

.el-input__prefix {
  display: none;

  .el-input--medium .el-input__icon {
    display: none;
  }
}

.analysis-title {
  font-family: 'Arial Negreta', 'Arial';
  font-size: 16px;
  color: #333333;
  text-align: center;
  line-height: 45px;
  font-weight: 700;
  background: #f0f0f0;
}

.blockT {
  background-color: white;
  margin: 5px;
  border: 1px solid #b5b5b5;
  display: block;
  line-height: 40px;
  padding: 0 10px;
}

.panel-group {
  //margin-top: 18px;
  margin-bottom: 50px;
  display: flex;
  flex-wrap: wrap;

  .card-panel-col {
    width: auto !important;
    min-width: 250px;
    margin: 15px;
    // width: 250px;

    .card-right {
      width: 100%;
      padding: 0 10px;
      text-align: center;
      // width: 30%;
      font-size: 40px;
      font-weight: 600;
    }

    .card-text {
      font-size: 15px;
    }
    .card-left {
      width: 70%;
      padding-left: 25px;
      line-height: 35px;
      min-width: 125px;
    }
  }

  .card-panel-col2 {
    width: 200px;

    .card-right {
      height: 100%;
      width: 30%;
      padding: 25px;
      font-weight: 600;
    }

    .card-text {
      font-size: 20px;
    }

    .card-left {
      width: 70%;
      padding-left: 25px;
      line-height: 35px;
    }
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
  }

  .card-panel {
    display: flex;
    width: 100%;
    align-items: center;
    //height: 108px;
    height: 150px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    transition: 0.2s;
    border-radius: 10px;
    box-shadow: 0px 2px 3px #ccc;

    &:hover {
      box-shadow: 0px 4px 15px #ccc;
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
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: right;
      //margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: right;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin-top: 16px;
      padding-left: 20px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 15px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 30px;
      }
    }

    .card-panel-footer-text {
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

@media (max-width: 550px) {
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

.counter-area {
  background: $heavyBGColor;
  width: 100%;
  min-height: 50vh;
  margin-top: 4vh;
  padding: 5vh 2vw 5vh 2vw;
  transition: 0.2s;

  &:hover {
    box-shadow: 0px 4px 10px #ccc;
  }
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 30px 0px 10px 0px;
}

.el-table >>> th.is-leaf,
.el-table >>> td {
  border: none;
}

.el-table::before {
  height: 0px;
}

.dashbord-tab-list >>> .el-tabs__nav-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
  z-index: 1;
}

.dashbord-tab-list {
}

.dashbord-tab-list >>> .el-tabs__item {
  padding: 0 20px;
  height: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 30px;
  display: inline-block;
  list-style: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  color: #939393;
  position: relative;
}
</style>
