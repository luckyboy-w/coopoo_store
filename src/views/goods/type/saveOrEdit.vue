<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="dataForm.typeName" />
      </el-form-item>

      <el-form-item label="分类标签">
        <el-input v-model="dataForm.typeLabel" />
      </el-form-item>

      <el-form-item label="上级分类">
        <el-select v-model="dataForm.parentId" placeholder="请选择分类">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :value-key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="显示">
        <el-switch
          v-model="dataForm.show"
        />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="dataForm.sort" placeholder="请输入排序" />
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
      typeList: [{
        id: '-1',
        typeName: '一级分类'
      }],
      dataForm: {
        id: '',
        typeName: '',
        typeLabel: '',
        isShow: true,
        sort: '',
        parentId: '-1'
      }
    }
  },
  computed: {
  },
  mounted() {
    this.dataForm = this.editData
    this.findGoodType()
  },
  created() { },
  methods: {
    findGoodType() {
      const scope = this
      const param = {
        parentId: '-1'
      }
      getMethod('/backend/goodType/findList', param).then(res => {
        scope.typeList = res.data
        scope.typeList.unshift({
          id: '-1',
          typeName: '一级分类'
        })
      })
    },
    saveGoodType() {
      const scope = this
      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy
        delete this.dataForm.children
        postMethod('/backend/goodType/update', this.dataForm).then(res => {
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
      const notNvl = ['typeName', 'typeLabel', 'sort']
      for (let i = 0; i < notNvl; i++) {
        if (this.dataForm[notNvl[i]] == '') {
          this.$message({
            message: '字段不能为空',
            type: 'warning'
          })
          return false
        }
      }

      const needInt = ['sort']
      for (let i = 0; i < needInt; i++) {
        if (isInteger(this.dataForm[needInt[i]])) {
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
