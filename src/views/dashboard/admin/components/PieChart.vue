<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { mapGetters, mapState, mapActions } from 'vuex'

import variables from '@/styles/variables.scss'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '40vh'
    },
    circleColor: {
      type: Array,
      default: () => ['#82c6f7', '#F7D7B0', '#FD999B', '#916CC9', '#F7C92F']
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    variables() {
      return variables
    },
    ...mapGetters('dashboard', {
      chartsTitle: 'chartsTitle',
      chartsData: 'chartsData'
    }),
    ...mapState({})
  },
  watch: {
    chartsData() {
      this.chartSetData()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chartSetData()
    },
    handlerChartsData() {
      if (this.chartsData.length === 0) {
        return [
          {
            value: 0,
            name: '暂无数据',
            itemStyle: { color: '#ccc' }
          }
        ]
      }

      return this.chartsData.map((item, index) => {
        return {
          value: item.dataCnt,
          name: item.goodName,
          itemStyle: { color: this.circleColor[index] }
        }
      })
    },
    chartSetData() {
      let printData = this.handlerChartsData()
      this.chart.setOption({
        title: {
          text: this.chartsTitle,
          textStyle: {
            color: this.variables.fontColor,
            fontWeight: 600,
            fontFamily: 'PingFang SC',
            // 必须为60  否则页面右侧tab标签的高度也得改才能保证水平对齐
            lineHeight: 60
          },
          padding: 0
        },
        tooltip: {
          trigger: 'item',
          // formatter: '@{name} <span style="position: absolute;right: 15px">{c}</span><br/>{b}',
          formatter: function(params, ticket, callback) {
            const { data } = params
            return `<span style="display: inline-block;width: 15px;height: 15px;background: ${data.itemStyle.color}"></span>
                    <span style="position: absolute;right: 15px;font-weight: bold;font-size: 15px;line-height: 15px">${data.value}</span>
                    <br/>${data.name}`
          },
          borderWidth: '1',
          borderColor: this.variables.lineColor,
          backgroundColor: this.variables.heavyBGColor,
          padding: [
            5,  // 上
            15, // 右
            5,  // 下
            15 // 左
          ],
          textStyle: {
            color: this.variables.fontColor,
            fontWeight: 400,
            fontFamily: 'PingFang SC'
          }
        },
        // legend: {
        //   left: 'center',
        //   bottom: '10',
        //   data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        // },
        series: [
          {
            name: '',
            type: 'pie',
            // roseType 南丁格尔图
            // radius 扇区圆心角展现数据的百分比，半径展现数据的大小。
            // area 所有扇区圆心角相同，仅通过半径展现数据大小。
            // roseType: 'area',
            // radius: [50, 100],// 内外半径
            data: printData,
            // data: [
            //   { value: 1048, name: '搜索引擎', itemStyle: { color: this.circleColor[0] } },
            //   { value: 735, name: '直接访问', itemStyle: { color: this.circleColor[1] } },
            //   { value: 580, name: '邮件营销', itemStyle: { color: this.circleColor[2] } },
            //   { value: 484, name: '联盟广告', itemStyle: { color: this.circleColor[3] } },
            //   { value: 300, name: '视频广告', itemStyle: { color: this.circleColor[4] } }
            //   { value: 0, name: '无数据', itemStyle: { color: '#ccc' } }
            // ],
            label: {
              // 去除引导线
              show: false
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.asdf {
  background: black;
}
</style>
