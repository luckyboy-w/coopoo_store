<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="品牌名">
        <el-input v-model="dataForm.brandName" />
      </el-form-item>
      <el-form-item label="品牌简介">
        <div class="rich-text">
          <quill-editor ref="myQuillEditor" v-model="dataForm.brandDesc" class="editer" :options="editorOption" @ready="onEditorReady($event)" />
          <el-upload
            v-show="false"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
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
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module' // 引用
Quill.register('modules/imageResize', ImageResize) // 注册

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'FuncFormsEdit',
  components: {
    quillEditor
  },
  props: {
    editData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      data: {},
      uploadUrl: getUploadUrl(),
      action: '',
      headers: '',
      editorOption: {
        height: '400px',
        placeholder: '请输入品牌简介',
        modules: {
          toolbar: {
            container: [
              [{ 'size': ['small', false, 'large'] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['bold', 'italic'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link', 'image'],
              [{ 'direction': 'rtl' }]
            ],
            handlers: {
              'image': function(value) {
                if (value) {
                  // 调用eleUI图片上传
                  document.querySelector('.rich-text .avatar-uploader-icon').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          },
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        }
      },
      content: '',
      dataForm: {
        brandName: '',
        brandDesc: '',
        id: ''
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted() {
    this.dataForm = this.editData

    this.$nextTick(function() {
      if (this.editData.id) {
        this.dataForm = this.editData
        this.initDefaultImage()
      }
    })
  },
  created() {
  },
  methods: {
    handleAvatarSuccess(res, file) {
      const imageUrl = res.data.url
      const quill = this.$refs.myQuillEditor.quill
      const length = quill.getSelection().index
      quill.insertEmbed(length, 'image', imageUrl)
      quill.setSelection(length + 1)
      // this.dataForm.brandDesc = this.dataForm.brandDesc+'<img src='+imageUrl+'>'
    },
    handleChange() {

    },
    onEditorReady(editor) {
    },
    saveObject() {
      const scope = this
      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy

        const fileList = []

        this.dataForm.fileJsonStr = JSON.stringify(fileList)
        this.dataForm.files = []

        postMethod('/backend/goodBrand/update', this.dataForm).then(res => {
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
.update-form-panel{
  padding:30px 20px;
  width: 800px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
    display: none;
}
</style>
