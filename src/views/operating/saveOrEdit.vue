<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="公告类型">
        <el-select :disabled="isDisabled" v-model="dataForm.msgType" placeholder="请选择">
          <el-option :value="2" label="纯文字"></el-option>
          <el-option :value="1" label="图文并茂"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input :disabled="isDisabled" v-model="dataForm.title"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.msgType==1" label="封面图">
        <div id="front-img">
          <el-input v-show="false" v-model="dataForm.img" />
          <el-upload :disabled="isDisabled" :action="uploadAdvertUrl" list-type="picture-card" :on-preview="handleAdvertPreview"
            :before-upload="beforeAdvertUpload" :on-success="handleAdvertSuccess" :class="{hideTrue:hideAdvertUpload}"
            :file-list="uploadAdvertList" :on-remove="handleAdvertRemove">
            <i class="el-icon-plus" />
            <div slot="tip" class="el-upload__tip">推荐尺寸：1000*600
            </div>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="image" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="公告内容">
        <el-input v-if="dataForm.msgType==2" :disabled="isDisabled" v-model="dataForm.content" type="textarea" rows="5"></el-input>
        <qEditor v-if="dataForm.msgType==1" :disabled="isDisabled" :content="dataForm.content" ref="refEditor" moduleName="detailContent" @changeContent="changeContent">
        </qEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isDisabled"  @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from "@/api/request";
  import {
    isInteger
  } from "@/utils/validate";
  import qEditor from "@/components/RichText/quill-editor"

  export default {
    computed: {},
    components: {
      qEditor
    },
    mounted() {
      console.log(123456)
      this.$nextTick(function() {
        if (this.editData.id) {
		this.isDisabled=true
          this.dataForm = this.editData;
          if (this.editData.img) {
            this.dataForm.msgType = 1;
            this.dataForm.img = this.editData.img;
            this.uploadAdvertList.push({
              url: this.editData.img
            })
            this.hideAdvertUpload=true
          }else{
            this.dataForm.msgType = 2;
          }
          this.$refs.refEditor.richText = this.dataForm.content
        }
      });
    },
    created() {},
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
		  isDisabled:false,
        fileSortImage: 0,
        imageUrl: "",
        dataForm: {
		  msgType:2,
          img: "",
          title: "",
          content: "",
        },
        dialogVisible:false,
        uploadAdvertList: [],
        hideAdvertUpload: false,
        dialogImageUrl:'',
        uploadAdvertUrl: getUploadUrl(),
        fileSortImage: 0,
        image: "",
      }
    },
    methods: {
      changeContent(val) {
        this.dataForm.content = val
      },
      handleAdvertPreview(file) {
		  console.log('11',file);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleAdvertRemove(res) {
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].url == (res.url || res.response.data.url)) {
            this.uploadAdvertList.splice(i, 1);
            break;
          }
        }
        this.hideAdvertUpload=false
      },
      handleAdvertSuccess(res, file) {
        console.log(res, file)
        this.dataForm.img = res.data.url
        res.data.fileType = file.raw.type;
        res.data.sort = this.fileSortImage++;
        this.uploadAdvertList.push(res.data);
        let groupId = res.data.groupId;
        let imageCnt = 0;
        for (let i = 0; i < this.uploadAdvertList.length; i++) {
          if (this.uploadAdvertList[i].groupId == groupId) {
            imageCnt++;
          }
        }
        if (this.uploadAdvertList.length >= 1) {
          this.hideAdvertUpload=true
        }
        console.log(this.uploadAdvertList)
      },
      beforeAdvertUpload(file) {
        const fileTypeVerify =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!fileTypeVerify) {
          this.$message.error("上传文件格式错误!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        return fileTypeVerify && isLt2M;
      },
      saveObject() {
        let scope = this;
        if (this.validate()) {
          delete this.dataForm.createTime;
          delete this.dataForm.createBy;
          console.log(this.dataForm)
          postMethod("/msg/send-active-info", this.dataForm).then(res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          });
        }
      },
      validate() {
        let notNvl = ["title", "content"];
        for (let i = 0; i < notNvl.length; i++) {
          if (this.dataForm[notNvl[i]] == "") {
            this.$message({
              message: "字段不能为空",
              type: "warning"
            });
            return false;
          }
        }

        let needInt = [];
        for (let i = 0; i < needInt.length; i++) {
          if (!isInteger(this.dataForm[needInt[i]])) {
            this.$message({
              message: "请输入正整数",
              type: "warning"
            });
            return false;
          }
        }

        return true;
      },
      cancelUpdate() {
        this.$emit("showListPanel", true);
      },
      submitUpdate() {
        this.saveObject();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .update-form-panel {
    padding: 30px 20px;
    width: 600px;
  }
</style>
<style lang="scss">
  .hideTrue .el-upload--picture-card {
    display: none;
  }
</style>
