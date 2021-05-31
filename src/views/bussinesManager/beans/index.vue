<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="120px">
      <el-form-item label="邀请好友">
        <el-input v-model="dataForm.inviteFri" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="完善会员信息">
        <el-input v-model="dataForm.finishInfo" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="分享已购买商品">
        <el-input v-model="dataForm.shareGood" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="评价">
        <el-input v-model="dataForm.evalGood" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="新手购物">
        <el-input v-model="dataForm.firstPay" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="文案显示">
        <el-input v-model="dataForm.beanContent" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveObject">添加</el-button>
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
    this.loadData()
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
      dataForm: {
        inviteFri: "",
        finishInfo: "",
        shareGood: "",
        evalGood: "",
        firstPay: "",
        beanContent:''
      }
    };
  },
  methods: {
    loadData(){
      let param = {
        typeName:'bussCfg'
      }

      getMethod("/backend/lyConfig/findList", param).then(
        res => {
          let dataList = res.data
          for(let i = 0 ; i < dataList.length ; i++){
              let rowObj = dataList[i];
              this.dataForm[rowObj.title] = rowObj.value
          }

        }
      );
    },
    saveObject() {
      let scope = this;
      if (this.validate()) {
        let dataList = []
        dataList.push({
          typeName:'bussCfg',
          title:'inviteFri',
          value: this.dataForm.inviteFri
        });
        dataList.push({
          typeName:'bussCfg',
          title:'finishInfo',
          value: this.dataForm.finishInfo
        });
        dataList.push({
          typeName:'bussCfg',
          title:'shareGood',
          value: this.dataForm.shareGood
        });
        dataList.push({
          typeName:'bussCfg',
          title:'evalGood',
          value: this.dataForm.evalGood
        });
        dataList.push({
          typeName:'bussCfg',
          title:'firstPay',
          value: this.dataForm.firstPay
        });
        let param = {
          paramJson:JSON.stringify(dataList)
        }
        postMethod("/backend/lyConfig/update", param).then(
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
