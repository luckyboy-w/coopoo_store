<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="服务名称">
        <el-input v-model="dataForm.serviceName" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="兑换靠谱豆">
        <el-input v-model="dataForm.beanCost" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="服务图片">
        <el-input v-show="false" v-model="dataForm.serviceIcon"></el-input>
        <el-upload
          :action="uploadServiceIconUrl"
          list-type="picture-card"
          :on-preview="handleServiceIconPreview"
          :before-upload="beforeServiceIconUpload"
          :on-success="handleServiceIconSuccess"
          :class="{hide:hideServiceIconUpload}"
          :file-list="uploadServiceIconList"
          :on-remove="handleServiceIconRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="imageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="dataForm.enable" inactive-value=0 active-value=1> </el-switch>
      </el-form-item>
      <el-form-item label="门店服务介绍">
        <qEditor :content="dataForm.serviceContent" :moduleName="moduleName"  @changeContent="changeContent" ></qEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate"
import qEditor from "@/components/RichText/quill-editor"

export default {
  computed: {},
  components: { qEditor },
  mounted() {
    this.buildServiceIconGroupId();
    this.$nextTick(function() {
      if (this.editData.id) {
        this.dataForm = this.editData;
        this.initDefaultImage();
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
      uploadServiceIconList: [],
      hideServiceIconUpload: false,
      uploadServiceIconUrl: "",
      fileSortImage: 0,
      imageUrl: "",
      fileList: [],
      dataForm: {
        serviceContent: "",
        serviceName: "",
        beanCost: "",
        enable: true,
        serviceIcon: "",
        id: ""
      }
    };
  },
  methods: {
    changeContent(val){
			this.dataForm.serviceContent = val
		},
    buildServiceIconGroupId() {
      getMethod("/backend/oss/groupId", null).then(res => {
        this.uploadServiceIconUrl = getUploadUrl() + "?groupId=" + res.data;
        this.dataForm.serviceIcon = this.dataForm.serviceIcon || res.data;
      });
    },
    handleServiceIconPreview() {},
    handleServiceIconRemove(res) {
      for (let i = 0; i < this.uploadServiceIconList.length; i++) {
        if (this.uploadServiceIconList[i].id == (res.id || res.response.data.id)) {
          this.uploadServiceIconList.splice(i, 1);
          break;
        }
      }
      this.hideServiceIconUpload = false;
    },
    handleServiceIconSuccess(res, file) {
      res.data.fileType = file.raw.type;
      res.data.sort = this.fileSortImage++;
      this.uploadServiceIconList.push(res.data);
      let groupId = res.data.groupId;
      let imageCnt = 0;
      for (let i = 0; i < this.uploadServiceIconList.length; i++) {
        if (this.uploadServiceIconList[i].groupId == groupId) {
          imageCnt++;
        }
      }
      if (imageCnt >= 1) {
        this.hideServiceIconUpload = true;
      }
    },
    beforeServiceIconUpload(file) {
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
    initDefaultImage() {
      this.fileList = this.dataForm.files;
      for (let i = 0; i < this.dataForm.files.length; i++) {
        let imageObj = this.dataForm.files[i];
        if (imageObj.groupId == this.dataForm.serviceIcon) {
          this.uploadServiceIconList.push(imageObj);
        }
      }
      if (this.uploadServiceIconList.length >= 1) {
        this.hideServiceIconUpload = true;
      }
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        delete this.dataForm.createTime;
        delete this.dataForm.createBy;

        let fileList = [];
        fileList = fileList.concat(this.uploadServiceIconList);
        this.dataForm.fileJsonStr = JSON.stringify(fileList);
        this.dataForm.files = [];

        postMethod("/backend/storeServiceRule/update", this.dataForm).then(
          res => {
            scope.typeList = res.data;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("showListPanel", true);
          }
        );
      }
    },
    validate() {
      let notNvl = ["serviceName", "beanCost"];
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
  width: 800px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
