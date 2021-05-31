<template>
	<div>
		<table style="background:#F2F2F2;width:100%">
			<tr style="line-height:40px">
				<td style="font-size:16px;color:#333333;width:50px" rowspan="2"></td>
				<td style="font-size:16px;color:#333333;">友情提示</td>
			</tr>
			<tr style="line-height:40px">
				<td
					style="font-size:14px;color:#666666;"
				>商品属性值填写时，各个值之间使用半角逗号分隔，如：红色,白色,蓝色,粉色，发布商品时可以选择属性值，只用于商品详情页显示，不用于列表筛选。</td>
			</tr>
		</table>
		<div class="update-form-panel">
			<el-form ref="dataForm" :model="dataForm" label-width="80px">
				<el-form-item label="属性名称">
					<el-input v-model="dataForm.attrName"></el-input>
				</el-form-item>
				<el-form-item label="属性值">
					<el-input v-model="dataForm.attrValue"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input v-model="dataForm.sort"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitUpdate">添加</el-button>
					<el-button @click="cancelUpdate">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
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
			fileList: [],
			dataForm: {
				attrName: "",
				attrValue: "",
				sort: "",
				id: ""
			}
		};
	},
	methods: {
		initDefaultImage() {},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];

				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				postMethod("/backend/goodAttr/modity", this.dataForm).then(
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
			let notNvl = ["attrName", "attrValue", "sort"];
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
