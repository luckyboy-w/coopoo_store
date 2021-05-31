<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="80px">
			<el-form-item label="推送类型">
                <el-select v-model="dataForm.pushType">
                    <el-option
                        v-for="item in pushTypeList"
                        :key="item.id"
                        :value-key="item.label"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="推送标题">
				<el-input v-model="dataForm.infoTitle"></el-input>
			</el-form-item>
			<el-form-item label="推送内容">
				<el-input v-model="dataForm.infoContent"
                    type="textarea"
                    :rows="4"
                ></el-input>
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
import { isInteger } from "@/utils/validate";

export default {
	computed: {},
	mounted() {
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
			fileSortImage: 0,
			imageUrl: "",
			pushTypeList: this.GLOBAL.pushTypeList,
			dataForm: {
				pushType: "",
				infoTitle: "",
				infoContent: "",
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

				postMethod("/backend/push/update", this.dataForm).then(res => {
					scope.typeList = res.data;
					this.$message({
						message: "操作成功",
						type: "success"
					});
					this.$emit("showListPanel", true);
				});
			}
		},
		validate() {
			let notNvl = ["infoTitle", "infoContent"];
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
