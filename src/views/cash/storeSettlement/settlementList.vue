<template>
  <div class="" >
    <div style="margin: 20px;" >
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未结算" name="noSettlement">
        <span slot="label" class="my-tab-label">未结算</span>
        <noSettlement v-if="noSettlement"   />
      </el-tab-pane>
      <el-tab-pane label="待审核" name="toAudit">
        <span slot="label" class="my-tab-label">待审核</span>
        <toAudit v-if="toAudit"   />
      </el-tab-pane>
      <el-tab-pane label="已结算" name="settlementBy">
        <span slot="label" class="my-tab-label">已结算</span>
        <settlementBy v-if="settlementBy"   />
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
  import noSettlement from './noSettlement.vue'
  import toAudit from './toAudit.vue'
  import settlementBy from './settlementBy.vue'

import {
  formatDate
} from '@/api/tools.js'
import {
  getToken
} from '@/utils/auth'

export default {
  components: {
    noSettlement,toAudit,settlementBy
  },
  data() {
    return {
      noSettlement:true,
      toAudit:false,
      settlementBy:false,
      activeName: 'noSettlement',

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
        this.noSettlement = true
        this.toAudit = false
        this.settlementBy = false

      } else if (tab.index == 1) {
       this.noSettlement = false
       this.toAudit = true
       this.settlementBy = false
      } else if (tab.index == 2) {
       this.noSettlement = false
       this.toAudit = false
       this.settlementBy = true
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
