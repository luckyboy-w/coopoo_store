<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="nickName" label="昵称" width="180" />
    <el-table-column prop="subject" label="标题" width="180" />
    <el-table-column prop="email" label="邮箱" width="180" />
    <el-table-column prop="content" label="内容" width="180" />
    <el-table-column prop="createTime" label="发布时间" />
  </el-table>
</template>

<script>
import { getMethod } from '@/api/request'
export default {
  data() {
    return {
      tableData: []
    }
  },
  mounted() {},
  created() {
    this.loadMessage()
  },
  methods: {
    loadMessage() {
      const scope = this
      getMethod('/backend/message-cv/findPage', '').then(res => {
        scope.tableData = res.data
      })
    },
    callSelectChoice: () => {

    }
  }
}
</script>
