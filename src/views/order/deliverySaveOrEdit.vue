<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="100px">

      <el-form-item label="快递公司">
        <el-select v-model="selectDeliveryCompany"
                   size="small"
                   value-key="id"
                   placeholder="请选择物流公司"
                   @change="selectCompanyFun"
                   filterable
        >
          <el-option v-for="(item) in deliveryCompanyList" :key="item.id" :value="item" :label="item.expressName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="selectDeliveryType"
                   size="small"
                   value-key="id"
                   placeholder="请选择业务类型"
                   @change="selectTypeFun"
                   multiple
        >
          <el-option v-for="(item) in deliveryTypeList" :key="item.id" :value="item" :label="item.expressTypeName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="结款方式">
        <el-select v-model="selectPaymentMethod"
                   size="small"
                   value-key="id"
                   placeholder="请选择结款方式"
                   @change="selectPaymentMethodFun"
        >
          <el-option v-for="(item) in paymentMethodList" :key="item.id" :value="item" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-switch v-model="dataForm.isDefault" inactive-value="0" active-value="1"/>
      </el-form-item>
      <el-form-item
        v-for="(item,index) in deliveryAttrList"
        :label="item.attributeName"
        :key="item.id"
      >
        <el-input v-model="dataForm.kdnArgs[item.attributeValue]"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">提交</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, putMethod } from '@/api/request-new'

export default {
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      deliveryCompanyList: [],
      selectDeliveryCompany: '',
      deliveryTypeList: [],
      selectDeliveryType: [],
      deliveryAttrList: [],
      // 付款方式 【1 到付】【2 现付】【3 月结】
      paymentMethodList: [
        { id: 1, name: '到付' },
        { id: 2, name: '现付' },
        { id: 3, name: '月结' }
      ],
      // attrvalue : userInput
      selectPaymentMethod: '',
      selectedOptions: [],
      dataForm: {
        companyId: '',
        deliveryType: '',
        paymentMethod: '',
        isDefault: '0',
        kdnArgs: {}
      }
    }
  },
  created() {
    if (Object.keys(this.editData).length !== 0) {
      this.selectDeliveryCompany = this.editData.expressName
      this.selectDeliveryType = this.editData.deliveryTypeList
      this.selectPaymentMethod = this.paymentMethodList.filter((item) => item.id == this.editData.paymentMethod)[0].name
    }
  },
  mounted() {
    this.loadDeliveryCompanyList()
    this.loadDeliveryTypeList(this.editData ? this.editData.companyId : 0)
    this.loadDeliveryAttrList(this.editData ? this.editData.companyId : 0)
    this.dataForm = { ...this.dataForm, ...this.editData }
    this.dataForm.isDefault = this.dataForm.isDefault == 1 ? '1' : '0'
  },
  methods: {
    async loadDeliveryCompanyList() {
      const { data } = await getMethod('/delivery/allCompanyList')
      this.deliveryCompanyList = data
    },
    async loadDeliveryTypeList(companyId) {
      if (companyId > 0) {
        const { data } = await getMethod(`/delivery/allTypeList/${companyId}`)
        this.deliveryTypeList = data
      }
    },
    async loadDeliveryAttrList(companyId) {
      if (companyId > 0) {
        const { data } = await getMethod(`/delivery/attrList/${companyId}`)
        this.deliveryAttrList = data
      }
    },
    selectCompanyFun(dataItem) {
      this.dataForm.companyId = dataItem.id
      this.dataForm.deliveryType = ''
      this.selectDeliveryType = []
      this.loadDeliveryTypeList(dataItem.id)
      this.deliveryAttrList = []
      this.dataForm.kdnArgs = {}
      this.loadDeliveryAttrList(dataItem.id)
    },
    selectTypeFun(dataItem) {
      this.dataForm.deliveryType = dataItem.map(item => item.id).join(',')
    },
    selectPaymentMethodFun(dataItem) {
      this.dataForm.paymentMethod = dataItem.id
    },
    validate() {
      const notNvl = {
        'deliveryType': '业务类型不能为空',
        'paymentMethod': '借款方式不能为空'
      }

      for (const key in notNvl) {
        if (this.dataForm[key] == '') {
          this.$message.warning(notNvl[key])
          return false
        }
      }

      if (this.deliveryAttrList.length != 0 && Object.keys(this.dataForm.kdnArgs).length == 0) {
        this.$message.warning('快递鸟参数不能为空')
        return false
      }

      return true
    },
    async addObject() {
      if (this.validate()) {
        this.dataForm.kdnArgs = JSON.stringify(this.dataForm.kdnArgs)
        const { code } = await postMethod('/delivery/company', this.dataForm)
        if (code != 200) {
          this.$message.error('操作失败')
          return
        }
        this.$message.success('操作成功')
        this.$emit('showListPanel', true)
      }
    },
    async updateObject() {
      if (this.validate()) {
        this.dataForm.kdnArgs = JSON.stringify(this.dataForm.kdnArgs)
        const { code } = await putMethod('/delivery/company', this.dataForm)
        if (code != 200) {
          this.$message.error('操作失败')
          return
        }
        this.$message.success('操作成功')
        this.$emit('showListPanel', true)
      }
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      if (this.dataForm.id == undefined) {
        this.addObject()
      } else {
        this.updateObject()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 600px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
