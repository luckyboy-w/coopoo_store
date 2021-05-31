<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="80px">
			<el-form-item label="店员名称">
				<el-input v-model="dataForm.empName"></el-input>
			</el-form-item>
			<el-form-item label="手机号码">
				<el-input v-model="dataForm.mobilePhone"></el-input>
			</el-form-item>
			<el-form-item label="店铺ID" v-show="false">
				<el-input v-model="dataForm.storeId"></el-input>
			</el-form-item>
			<el-form-item label="是否启用" >
				<el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitUpdate">提交</el-button>
				<el-button @click="cancelUpdate">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate";

export default {
	computed: {},
	mounted() {
		this.$nextTick(function() {
			if (this.editData.id) {
				this.dataForm = this.editData;
				this.initDefaultImage();
      }
      this.dataForm.storeId = this.storeId
		});
	},
	created() {},
	props: {
		editData: {
			type: Object,
			required: false
    },
    storeId:{
      type: String,
      required: false
    }
	},
	data() {
		return {
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				empName: "",
				mobilePhone: "",
				storeId: "",
				enable: "1",
				id: ""
			}
		};
	},
	methods: {
		initDefaultImage() {
			this.fileList = this.dataForm.files;
			for (let i = 0; i < this.dataForm.files.length; i++) {
				let imageObj = this.dataForm.files[i];
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];

				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				postMethod("/backend/storeEmp/update", this.dataForm).then(
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
			let notNvl = [];
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
.hide .el-upload--picture-card {
	display: none;
}
</style>
