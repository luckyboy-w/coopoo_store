<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="140px">
			<el-form-item label="活动名称">
				<el-input v-model="dataForm.activityName" style="width:400px"></el-input>
			</el-form-item>
			<el-form-item label="报名靠谱豆">
				<el-input v-model="dataForm.activityCost" style="width:400px"></el-input>
			</el-form-item>
			<el-form-item label="活动主图">
				<el-input v-show="true" v-model="dataForm.activityImage"></el-input>
				<el-upload
					:action="uploadActivityImageUrl"
					list-type="picture-card"
					:on-preview="handleActivityImagePreview"
					:before-upload="beforeActivityImageUpload"
					:on-success="handleActivityImageSuccess"
					:class="{hide:hideActivityImageUpload}"
					:file-list="uploadActivityImageList"
					:on-remove="handleActivityImageRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>-
				<el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
			</el-form-item>

			<el-form-item label="活动详情">
				<qEditor :content="dataForm.activityContent" :moduleName="moduleName"></qEditor>
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
import qEditor from "@/components/RichText/quill-editor";

export default {
	components: { qEditor },
	mounted() {
		this.buildActivityImageGroupId();
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
			moduleName:'activityContentName',
			uploadActivityImageList: [],
			hideActivityImageUpload: false,
			uploadActivityImageUrl: "",
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				activityName: "",
				activityCost: "",
				enable: true,
				activityImage: "",
				startTime: "",
				endTime: "",
				activityContent:"",
				id: ""
			}
		}
	},
	methods: {
		buildActivityImageGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadActivityImageUrl = getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.activityImage = this.dataForm.activityImage || res.data;
			});
		},
		handleActivityImagePreview() {},
		handleActivityImageRemove(res) {
			for (let i = 0; i < this.uploadActivityImageList.length; i++) {
				if (this.uploadActivityImageList[i].id == (res.id || res.response.data.id)) {
					this.fileLiuploadActivityImageListst.splice(i, 1);
					break;
				}
			}
			this.hideActivityImageUpload = false;
		},
		handleActivityImageSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadActivityImageList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadActivityImageList.length; i++) {
				if (this.uploadActivityImageList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 1) {
				this.hideActivityImageUpload = true;
			}
		},
		beforeActivityImageUpload(file) {
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
				if (imageObj.groupId == this.dataForm.activityImage) {
					this.uploadActivityImageList.push(imageObj);
				}
			}
			if (this.uploadActivityImageList.length >= 1) {
				this.hideActivityImageUpload = true;
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];
				fileList = fileList.concat(this.uploadActivityImageList);
				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				this.dataForm.endTime = this.dataForm.endTime.Format(
					"yyyy-MM-dd hh:mm:ss"
				);
				this.dataForm.startTime = this.dataForm.startTime.Format(
					"yyyy-MM-dd hh:mm:ss"
				);

				postMethod(
					"/backend/activityManager/update",
					this.dataForm
				).then(res => {
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
			let notNvl = ["activityName", "activityCost"];
			for (let i = 0; i < notNvl.length; i++) {
				if (this.dataForm[notNvl[i]] == "") {
					this.$message({
						message: "字段不能为空",
						type: "warning"
					});
					return false;
				}
			}

			let needInt = ["activityCost"];
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
	width: 900px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
	display: none;
}
</style>
