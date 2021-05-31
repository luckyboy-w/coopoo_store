<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="服务商等级">
        <el-input v-model="dataForm.providerLevel" />
      </el-form-item>        <el-form-item label="返佣比列">
        <el-input v-model="dataForm.providerRate" />
      </el-form-item>        <el-form-item label="说明">
        <el-input v-model="dataForm.roleDesc" />
      </el-form-item>        <el-form-item label="启动">
        <el-switch
          v-model="dataForm.禁用"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { isInteger } from '@/utils/validate'

export default {
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {

      dataForm: {
        providerLevel: '',
        providerRate: '',
        roleDesc: '',
        禁用: true,
        id: ''
      }
    }
  },
  computed: {
  },
  mounted() {
    this.dataForm = this.editData
  },
  created() { },
  methods: {

    saveGoodType() {
      const scope = this
      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy
        postMethod('/backend/providerRole/update', this.dataForm).then(res => {
          scope.typeList = res.data
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('showListPanel', true)
        })
      }
    },
    validate() {
      const notNvl = []
      for (let i = 0; i < notNvl.length; i++) {
        if (this.dataForm[notNvl[i]] == '') {
          this.$message({
            message: '字段不能为空',
            type: 'warning'
          })
          return false
        }
      }

      const needInt = ['providerRate']
      for (let i = 0; i < needInt.length; i++) {
        if (!isInteger(this.dataForm[needInt[i]])) {
          this.$message({
            message: '请输入正整数',
            type: 'warning'
          })
          return false
        }
      }

      return true
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      this.saveGoodType()
    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel{
  padding:30px 20px;
  width: 600px;
}
</style>
