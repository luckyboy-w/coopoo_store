<template>
   <div class="rich-text2">
        <quill-editor v-model="rich_text2"  ref="myQuillEditor2" class="editer" :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
        <el-upload 
        v-show='false'
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess2">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from '@/utils/validate'
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module'; // 引用
Quill.register('modules/imageResize', ImageResize); // 注册

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


export default {
  name: 'FuncFormsEdit2',
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor2.quill
    }
  },
  props: {
      q2content:{
        type: String,
        required: false
      }
  },
  mounted(){
  },
  created() {
  },
  watch: {
      'rich_text2': function(newVal){
         this.$emit('changeListDetailContent',newVal)
      }
  },
  data() {
      return {
        rich_text2:'',
        imageUrl:'',
        data:{},
        uploadUrl:getUploadUrl(),
        action:'',
        headers:'',
        editorOption: {
          height:'400px',
          placeholder: '请输入内容',
          modules:{
            toolbar: {
              container:[
                [{ 'size': ['small', false, 'large'] }],
                [{ 'color': [] }, { 'background': [] }], 
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['bold', 'italic'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                [{ 'direction': 'rtl' }],
              ],
              handlers: {
                  'image': function (value) {
                      if (value) {
                          // 调用eleUI图片上传
                          document.querySelector('.rich-text2 .avatar-uploader-icon').click()
                      } else {
                          this.quill.format('image', false);
                      }
                  }
              }
            },
            imageResize:{
              displayStyles:{
                backgroundColor:'black',
                border:'none',
                color:'white'
              },
              modules:['Resize','DisplaySize','Toolbar']
            }
          }
        },
        dataForm:{
          brandName:'',
          brandDesc:'',
          id:''
        }
      }
  },
  methods: {
    setContent(val){
      this.rich_text2 = val
    },
    onEditorReady(event){

    },
    handleAvatarSuccess2(res,file){
      let imageUrl = res.data.url
      let quill = this.$refs.myQuillEditor2.quill
      let length = quill.getSelection().index;
      quill.insertEmbed(length, 'image', imageUrl)
      quill.setSelection(length + 1)
      //this.dataForm.brandDesc = this.dataForm.brandDesc+'<img src='+imageUrl+'>'
    }
  }
}
</script>
<style>
.ql-editor{
  max-height:400px!important;
}
</style>