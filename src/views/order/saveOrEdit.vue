<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="100px">
      <el-form-item label="地址名称">
        <el-input v-model="dataForm.addrName"/>
      </el-form-item>
      <!--      <el-form-item label="地址类型">-->
      <!--        <el-input value="退货地址" disabled/>-->
      <!--        &lt;!&ndash; <el-select v-model="dataForm.type"> &ndash;&gt;-->
      <!--        &lt;!&ndash; <el-option value="1" label="发货地址" /> &ndash;&gt;-->
      <!--        &lt;!&ndash; <el-option value="2" label="退货地址" />-->
      <!--       </el-select> &ndash;&gt;-->
      <!--      </el-form-item>-->
      <el-form-item label="地址序号">
        <el-input v-model="dataForm.addrSeq"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="dataForm.person"/>
      </el-form-item>
      <el-form-item label="电话类型">
        <el-select v-model="phoneType" placeholder="请选择电话类型">
          <el-option value="1" label="手机号"></el-option>
          <el-option value="2" label="固定电话"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" v-if="phoneType == '1'">
        <el-input v-model="dataForm.mobilePhone"/>
      </el-form-item>
      <el-form-item label="固定电话" v-if="phoneType == '2'">
        <el-input v-model="dataForm.telPhone"/>
      </el-form-item>
      <el-form-item label="地区号">
        <el-input v-model="dataForm.areaNo"/>
      </el-form-item>
      <el-form-item label="所在城市" style="width: 1000px">
        <el-select v-model="selectProvince" size="small" value-key="provinceid" placeholder="请选择省份"
                   @change="selectProvinceFun"
        >
          <el-option v-for="(item) in city" :key="item.provinceid" :value="item" :label="item.province"/>
        </el-select>
        <el-select v-model="selectCity" size="small" value-key="cityid" placeholder="请选择城市" @change="selectCityFun">
          <el-option v-for="(item) in cityList" :key="item.cityid" :value="item" :label="item.city"/>
        </el-select>
        <el-select v-model="selectArea" size="small" value-key="areaid" placeholder="请选择区县" @change="selectAreaFun">
          <el-option v-for="(item) in areaList" :key="item.areaid" :value="item" :label="item.area"/>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="dataForm.addrDtl"/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"/>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-switch v-model="dataForm.isDefault" inactive-value="0" active-value="1"/>
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
import { postMethod as postMethodNew} from '@/api/request-new'
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
      city: [],
      cityList: [],
      areaList: [],
      selectProvince: '',
      selectCity: '',
      selectArea: '',
      selectedOptions: [],
      fileSortImage: 0,
      imageUrl: '',
      phoneType: '2',
      fileList: [],
      dataForm: {
        isDefault: '0',
        type: '1',
        addrName: '',
        addrSeq: '',
        person: '',
        mobilePhone: '',
        telPhone: '',
        areaNo: '',
        provinceid: '',
        provincetext: '',
        cityid: '',
        citytext: '',
        areaId: '',
        areaText: '',
        addrDtl: '',
        enable: true,
        id: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.loadProvinceList()
    this.$nextTick(function() {
      if (this.editData.addrId) {
        this.dataForm = this.editData
        this.dataForm.isDefault = this.dataForm.isDefault == 1 ? '1' : '0'
      }
    })
  },
  created() {
    this.selectProvince = this.editData.provincetext
    this.selectCity = this.editData.citytext
    this.selectArea = this.editData.areaText
  },
  methods: {
    loadProvinceList() {
      const scope = this
      getMethod('/bc/province/findProvince').then(res => {
        scope.city = res.data
      })
    },
    selectProvinceFun(event) {
      this.selectCity = ''
      this.selectArea = ''
      this.dataForm.citytext = ''
      this.dataForm.areaText = ''
      if (event) {
        this.cityList = event.cityList
      } else {
        this.cityList = []
      }
      this.dataForm.provinceid = event.provinceid
      this.dataForm.provincetext = event.province
    },
    selectCityFun(event) {
      this.selectArea = ''
      this.dataForm.areaText = ''
      if (event) {
        this.areaList = event.areasList
      } else {
        this.areaList = []
      }
      this.dataForm.cityid = event.cityid
      this.dataForm.citytext = event.city
    },
    selectAreaFun(event) {
      this.dataForm.areaId = event.areaid
      this.dataForm.areaText = event.area
    },
    saveObject() {
      const scope = this
      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy
        postMethodNew('/address/update', this.dataForm).then(
          res => {
            scope.typeList = res.data
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('showListPanel', true)
          }
        )
      }
    },
    validate() {
      const notNvl = {
        'addrName': '地址名称不能为空',
        'person': '联系人不能为空',
        'addrDtl': '地址不能为空',
        'citytext': '省份信息不能为空',
        'provincetext': '省份信息不能为空',
        'areaText': '省份信息不能为空'
      }

      if (this.phoneType == 1) {
        if (this.dataForm.mobilePhone == '' || this.dataForm.mobilePhone == undefined || this.dataForm.mobilePhone == null) {
          this.$message({
            message: "手机号格式如:138xxxx8754",
            type: 'warning'
          })
          return false
        }

        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        const isPhone = reg.test(this.dataForm.mobilePhone);
        let value = Number(this.dataForm.mobilePhone); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {//判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
            this.$message({
              message: "手机号格式如:138xxxx8754",
              type: 'warning'
            })
            return false
          }
        } else {
          this.$message({
            message: "手机号输入错误",
            type: 'warning'
          })
          return false
        }

        this.dataForm.telPhone = null
      }

      if (this.phoneType == 2) {
        if (this.dataForm.telPhone == '' || this.dataForm.telPhone == undefined || this.dataForm.telPhone == null) {
          this.$message({
            message: "座机号输入错误",
            type: 'warning'
          })
          return false
        }

        const telReg = /^((d{3,4})|d{3,4}-|s)?d{7,14}$/;
        const isTelPhone = telReg.test(this.dataForm.telPhone);
        if (isTelPhone) {
          this.$message({
            message: "座机号输入错误",
            type: 'warning'
          })
          return false
        }

        this.dataForm.mobilePhone = null
      }

      if (this.dataForm.addrDtl == null || this.dataForm.addrDtl == undefined || this.dataForm.addrDtl.length > 50) {
        this.$message({
          message: "详细地址输入错误",
          type: 'warning'
        })
        return false
      }

      for (const key in notNvl) {
        if (this.dataForm[key] == '') {
          this.$message({
            message: notNvl[key],
            type: 'warning'
          })
          return false
        }
      }
      const needInt = []
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
      this.saveObject()
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
