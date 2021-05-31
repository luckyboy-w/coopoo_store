<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="80px">
			<el-form-item label="商品图片">
				<el-input v-show="true" v-model="dataForm.goodImage"></el-input>
				<el-upload
					:action="uploadGoodImageUrl"
					list-type="picture-card"
					:on-preview="handleGoodImagePreview"
					:before-upload="beforeGoodImageUpload"
					:on-success="handleGoodImageSuccess"
					:class="{hide:hideGoodImageUpload}"
					:file-list="uploadGoodImageList"
					:on-remove="handleGoodImageRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="分类名称">
				<el-input v-model="dataForm.typeName"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<el-input v-model="dataForm.typeLabel"></el-input>
			</el-form-item>
			<el-form-item label="排序">
				<el-input v-model="dataForm.sort"></el-input>
			</el-form-item>
			<el-form-item label="一级分类">
				<el-select v-model="dataForm.typeName">
					<el-option
						v-for="item in typeNameList"
						:key="item.id"
						:value-key="item.typeName"
						:label="item.typeName"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否显示">
				<el-switch v-model="dataForm.show" inactive-value="0" active-value="1"></el-switch>
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
		this.loadtypeNameList();
		this.buildGoodImageGroupId();
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
			typeNameList: [],
			uploadGoodImageList: [],
			hideGoodImageUpload: false,
			uploadGoodImageUrl: "",
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				typeName: "",
				typeLabel: "",
				sort: "",
				typeName: "",
				show: true,
                goodImage: "",
                iconFiles:[],
				id: ""
			}
		};
	},
	methods: {
		loadtypeNameList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend//goodType/findPage", param).then(res => {
				scope.typeNameList = res.data;
			});
		},
		buildGoodImageGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadGoodImageUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.goodImage = this.dataForm.goodImage || res.data;
			});
		},
		handleGoodImagePreview() {},
		handleGoodImageRemove(res) {
			for (let i = 0; i < this.uploadGoodImageList.length; i++) {
				if (
					this.uploadGoodImageList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadGoodImageList.splice(i, 1);
					break;
				}
			}
			this.hideGoodImageUpload = false;
		},
		handleGoodImageSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadGoodImageList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadGoodImageList.length; i++) {
				if (this.uploadGoodImageList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 5) {
				this.hideGoodImageUpload = true;
			}
		},
		beforeGoodImageUpload(file) {
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
				if (imageObj.groupId == this.dataForm.goodImage) {
					this.uploadGoodImageList.push(imageObj);
				}
			}
			if (this.uploadGoodImageList.length >= 1) {
				this.hideGoodImageUpload = true;
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];
				fileList = fileList.concat(this.uploadGoodImageList);
				this.dataForm.iconFiles = fileList;
				this.dataForm.files = [];

				postMethod("/backend/goodType/update", this.dataForm).then(
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
			let notNvl = ["typeName", "typeLabel", "sort"];
			for (let i = 0; i < notNvl.length; i++) {
				if (this.dataForm[notNvl[i]] == "") {
					this.$message({
						message: "字段不能为空",
						type: "warning"
					});
					return false;
				}
			}

			let needInt = ["sort"];
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
