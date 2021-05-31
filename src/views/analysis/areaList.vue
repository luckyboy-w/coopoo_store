<template>
  <div>
    <el-row :span="24" style="padding-top:50px">
        <el-col :span="12">
          <div ref="MapMountNode" class="charts chart-bar map-mount-node" style="width:80%;height:500px"></div>
        </el-col>
        <el-col :span="12">
           <div style="padding: 0px 10px;">
              <div>
                <el-table
                        ref="settleEndData"
                        :data="dataList"
                        style="width: 100%; margin-bottom: 20px;"
                        row-key="id">
                        <el-table-column prop="areaName" label="省份" min-width="70%">
                        </el-table-column>
                        <el-table-column prop="dataCnt" label="销量" min-width="30%">
                        </el-table-column>
                </el-table>
              </div>
            </div>
        </el-col>
    </el-row>

   
  </div>
</template>

<script>

  import echarts from 'echarts'
  import 'echarts/map/js/china'
  import { getMethod, postMethod } from "@/api/request";
  import { formatDate } from "@/api/tools.js"

  export default {
    name:'',
    props:[''],
    data () {
      return {
        areaData:[{
          name: '北京',
          value: 0.0
        },{
          name: '天津',
          value: 0.0
        },{
          name: '上海',
          value: 0.0
        },{
          name: '重庆',
          value: 0.0
        },{
          name: '河北',
          value: 0.0
        },{
          name: '河南',
          value: 0.0
        },{
          name: '云南',
          value: 0.0
        },{
          name: '辽宁',
          value: 0.0
        },{
          name: '黑龙江',
          value: 0.0
        },{
          name: '湖南',
          value: 0.0
        },{
          name: '安徽',
          value: 0.0
        },{
          name: '山东',
          value: 0.0
        },{ name: '新疆',
          value: 0.0
        },{
          name: '江苏',
          value: 0.0
        }, {
          name: '浙江',
          value: 0.0
        },{
          name: '江西',
          value: 0.0
        },{
          name: '湖北',
          value: 0.0
        },{
          name: '广西',
          value: 0.0
        },{
          name: '甘肃',
          value: 0.0
        },{
          name: '山西',
          value: 0.0
        },{
          name: '内蒙古',
          value: 0.0
        },{
          name: '陕西',
          value: 0.0
        },{
          name: '吉林',
          value: 0.0
        },{
          name: '福建',
          value: 0.0
        },{
          name: '贵州',
          value: 0.0
        },{
          name: '广东',
          value: 0.0
        },{
          name: '青海',
          value: 0.0
        },{
          name: '西藏',
          value: 0.0
        },{
          name: '四川',
          value: 0.0
        },{
          name: '宁夏',
          value: 0.0
        },{
          name: '海南',
          value: 0.0
        },{
          name: '台湾',
          value: 0.0
        },{
          name: '香港',
          value: 0.0
        },{
          name: '澳门',
          value: 0.0
        }],
        dataList:[]
      };
    },
    components: {},
    computed: {},
    beforeMount() {},
    methods: {
      resize () {
        this.MapMountNode.resize()
      },
      initData(){
        let scope = this;
        getMethod("/bc/analysis/findAreaList", {}).then(res => {

            let resData = res.data
            this.dataList = resData
            resData.forEach((rowObj) =>{
              for(var i = 0 ; i < this.areaData.length ; i++){
                if(rowObj.areaName.indexOf(this.areaData[i].name) != -1){
                  this.areaData[i].value = rowObj.dataCnt
                }
              }
            });
            scope.loadReport()
        });
      },
      loadReport(){
        this.$nextTick(() => {

          // 数据纯属虚构
          var data = this.areaData
          var yData = []
    
          data.sort(function (o1, o2) {
            if (isNaN(o1.value) || o1.value == null) return -1
            if (isNaN(o2.value) || o2.value == null) return 1
            return o1.value - o2.value
          })
    
          for (var i = 0; i < data.length; i++) {
            yData.push(data[i].name)
          }
          let option = {
    
            title: {
              text: '全国销量分布图',
              textStyle: {
                fontSize: 16
              },
              x: 'center'
            },
            visualMap: {
              type: 'continuous',
              text: ['', ''],
              showLabel: true,
              seriesIndex: [0],
              min: 0,
              max: 7,
              inRange: {
                color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096']
              },
              textStyle: {
                color: '#000'
              },
              bottom: 30,
              left: 'left'
            },
            grid: {
              right: 10,
              top: 80,
              bottom: 30,
              width: '20%'
            },
            xAxis: {
              type: 'value',
              scale: true,
              position: 'top',
              splitNumber: 1,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                margin: 2,
                textStyle: {
                  color: '#aaa'
                }
              }
            },
            yAxis: {
              type: 'category',
              nameGap: 16,
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#ddd'
                }
              },
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#ddd'
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#999'
                }
              }
            },
            geo: {
              roam: true,
              map: 'china',
              left: 'left',
              right: '10',
              layoutSize: '80%',
              label: {
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  areaColor: '#fff464'
                }
              },
              regions: [{
                name: '南海诸岛',
                value: 0,
                itemStyle: {
                  normal: {
                    opacity: 0,
                    label: {
                      show: false
                    }
                  }
                }
              }]
            },
            series: [{
              name: 'mapSer',
              type: 'map',
              roam: false,
              geoIndex: 0,
              label: {
                show: false
              },
              data: data
            }]
    
          }
          this.MapMountNode = echarts.init(this.$refs.MapMountNode, 'tdTheme')
          this.MapMountNode.setOption(option)
        })
      }
    },
    mounted () {
      this.initData()
    },
    beforeDestroy () {

    },
    watch: {

    }
  }

</script>
<style lang='scss' scoped>
.analysis-title{
  font-family: 'Arial Negreta', 'Arial';
  font-size: 16px;
  color:#333333;
  text-align: center;
  line-height:45px;
  font-weight: 700;
  background: #F0F0F0;
}
</style>