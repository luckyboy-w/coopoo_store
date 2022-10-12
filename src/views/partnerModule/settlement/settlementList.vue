<template>
  <div class="" >
    <div style="margin: 20px;" >
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未结算" name="readyBill">
        <span slot="label" class="my-tab-label">未结算</span>
        <nvlBill v-if="nvlBill"   />
      </el-tab-pane>
      <el-tab-pane label="可结算" name="settleFinsh">
        <span slot="label" class="my-tab-label">可结算</span>
        <startBill v-if="startBill"   />
      </el-tab-pane>
      <el-tab-pane label="已结算" name="settleEnd">
        <span slot="label" class="my-tab-label">已结算</span>
        <finshBill v-if="finshBill"   />
      </el-tab-pane>

      <!-- <el-tab-pane label="明细" name="dataDtl" v-if="dataDtl" >
        <span slot="label" class="my-tab-label">明细</span>
      </el-tab-pane> -->

    </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  getMethod,
  postMethod
} from '@/api/request'
  import nvlBill from './nvlBill'
  import startBill from './startBill'
  import finshBill from './finshBill'

import {
  formatDate
} from '@/api/tools.js'
import {
  getToken
} from '@/utils/auth'

export default {
  components: {
    nvlBill,startBill,finshBill
  },
  data() {
    return {
      nvlBill:true,
      startBill:false,
      finshBill:false,
      activeName: 'readyBill',

    }
  },
  filters: {

  },
  mounted() {

  },
  methods: {

    handleClick(tab, event) {
      this.tabIndex = tab.index
      if (tab.index == 0) {
        this.nvlBill = true
        this.startBill = false
        this.finshBill = false

      } else if (tab.index == 1) {
       this.nvlBill = false
       this.startBill = true
       this.finshBill = false
      } else if (tab.index == 2) {
       this.nvlBill = false
       this.startBill = false
       this.finshBill = true
      }
    },

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$table-list-height: 6vh;

.my-tab-label {
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  //color: $fontColor;
  font-size: 16px;
  padding: 0px 10px;
}

.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;

}

</style>
