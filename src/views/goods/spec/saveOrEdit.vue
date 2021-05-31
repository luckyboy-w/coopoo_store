<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="绑定类目">
        <el-select v-model="typeData" multiple placeholder="请选择分类" style="width:100%">
          <el-option-group
            v-for="item in typeList"
            :key="item.id"
            :label="item.typeName"
          >
            <el-option
              v-for="childObj in item.children"
              :key="childObj.typeName"
              :label="childObj.typeName"
              :value="childObj.id"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="规格名称" :disabled="disableName">
        <el-input v-model="dataForm.specName"></el-input>
        <span>请填写常用的商品规格的名称；例如：颜色；尺寸等。</span>
      </el-form-item>
      <el-form-item label="备注名称">
        <el-input v-model="dataForm.specDescName"></el-input>
        <span>只有商家可见，用于商家更好的区别管理各个规格。</span>
      </el-form-item>
      <el-form-item label="规格序号">
        <el-input v-model="dataForm.specSort"></el-input>
        <span>请填写整数。</span>
      </el-form-item>
      <el-form-item label="新增规格">
        <el-button type="info" @click="appendSku()" plain>新增规格</el-button>
        <p/>
        <el-table
          :data="dataForm.skuList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="sort"
            label="排序"
            width="180"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="skuText"
            label="规格值"
            width="180"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuText"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="primary"
                  size="mini"
                >
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from '@/api/request'
import { isInteger } from '@/utils/validate'

export default {
  computed: {},
  mounted() {
    if (this.editData.id != undefined) {
      this.disableName = true
    }

    this.findGoodType()
  },
  created() {
  },
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      typeList: [],
      fileSortImage: 0,
      imageUrl: '',
      disableName: false,
      fileList: [],
      typeData: [],
      dataForm: {
        specName: '',
        specDescName: '',
        specSort: '',
        skuText: '',
        typeDataStr: '',
        typeData: [],
        skuList: [],
        id: ''
      }
    }
  },
  methods: {
    deleteRow(rowIndex, rowObj) {
      let scope = this
      if (rowObj.id != undefined) {
        scope.removeSku(rowIndex)
      }
    },
    findGoodType() {
      getMethod('/bu/goodSpec/findGoodType', this.searchParam).then(res => {
        this.typeList = res.data
        this.$nextTick(function() {
          if (this.editData.id) {
            if (this.editData.typeData == undefined) {
              this.editData.typeData = []
            }
            this.dataForm = this.editData
            let typeData = []
            for (let i = 0; i < this.editData.typeData.length; i++) {
              typeData.push(this.editData.typeData[i].typeId)
            }
            this.typeData = typeData

          }
        })
      })
    },
    removeSku(rowIndex) {
      this.dataForm.skuList.splice(rowIndex, 1)
    },
    appendSku() {
      if (this.dataForm.skuList == undefined) {
        this.dataForm.skuList = []
      }

      this.dataForm.skuList.push({
        sort: '',
        skuText: '',
        type: 'spec',
        id: ''
      })
    },
    saveObject() {
      let scope = this

      if (isNaN(this.dataForm.specSort)) {
        this.$message({
          message: '排序字段请输入数字',
          type: 'warning'
        })
        return
      }
      for (let i = 0; i < this.dataForm.skuList.length; i++) {
        if (isNaN(this.dataForm.skuList[i].sort)) {
          this.$message({
            message: '排序字段请输入数字',
            type: 'warning'
          })
          return
        }
        if (this.dataForm.skuList[i].skuText == '') {
          this.$message({
            message: '规格值不能为空',
            type: 'warning'
          })
          return
        }
      }

      var skuTextArray = this.dataForm.skuList.map(item => item.skuText)
      var isDuplicate = skuTextArray.some((item, idx) =>
        skuTextArray.indexOf(item) != idx
      )
      if (isDuplicate) {
        this.$message({
          message: '规格值不能重复',
          type: 'warning'
        })
        return
      }

      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy

        this.dataForm.typeDataStr = this.typeData.join(',')

        let param = {
          jsonParam: JSON.stringify(this.dataForm)
        }
        postMethod('/bu/goodSpec/update', param).then(res => {
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
      let notNvl = ['specName', 'specDescName', 'specSort']
      for (let i = 0; i < notNvl.length; i++) {
        if (this.dataForm[notNvl[i]] == '') {
          this.$message({
            message: '字段不能为空',
            type: 'warning'
          })
          return false
        }
      }

      let needInt = []
      for (let i = 0; i < needInt.length; i++) {
        if (!isInteger(this.dataForm[needInt[i]])) {
          this.$message({
            message: '请输入正整数',
            type: 'warning'
          })
          return false
        }
      }

      if (this.typeData == undefined || this.typeData.length == 0) {
        this.$message({
          message: '请选择绑定类目',
          type: 'warning'
        })
        return false
      }

      if (this.dataForm['skuList'] == undefined || this.dataForm['skuList'].length == 0) {
        this.$message({
          message: '请添加规格选项',
          type: 'warning'
        })
        return false
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
