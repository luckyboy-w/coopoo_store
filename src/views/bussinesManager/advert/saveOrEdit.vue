<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="130px">
			<el-form-item label="广告名称">
				<el-input v-model="dataForm.advertName"></el-input>
			</el-form-item>
			<el-form-item label="广告位置">
				<el-select v-model="dataForm.advertLocation">
					<el-option
						v-for="item in advertLocationList"
						:key="item.id"
						:value-key="item.label"
						:label="item.label"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="广告banner">
				<el-input v-show="false" v-model="dataForm.advertImage"></el-input>
				<el-upload
					:action="uploadAdvertUrl"
					list-type="picture-card"
					:on-preview="handleAdvertPreview"
					:before-upload="beforeAdvertUpload"
					:on-success="handleAdvertSuccess"
					:class="{hide:hideAdvertUpload}"
					:file-list="uploadAdvertList"
					:on-remove="handleAdvertRemove">
					
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="落地页链接">
				<el-input v-model="dataForm.advertUrl"
				placeholder="落地页链接请以http://或者https://开头"
				></el-input>
			</el-form-item>
			<el-form-item label="排序">
				<el-input v-model="dataForm.sort"></el-input>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch 
				inactive-value=0
				active-value=1
				v-model="dataForm.enable"></el-switch>
			<el-input v-model="dataForm.enable"></el-input>
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
		this.buildAdvertGroupId();
		
		this.$nextTick(function() {
			this.advertLocationList = this.GLOBAL.advertLocationList
			if (this.editData.id) {
				this.dataForm = this.editData
				this.dataForm.enable = this.editData.enable + ''
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
			advertLocationList:[],
			uploadAdvertList: [],
			hideAdvertUpload: false,
			uploadAdvertUrl: "",
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				advertName: "",
				advertUrl: "",
				sort: "",
				advertLocation: "",
				enable: 1,
				advertImage: "",
				id: ""
			}
		};
	},
	methods: {
		buildAdvertGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadAdvertUrl = getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.advertImage = this.dataForm.advertImage || res.data;
			});
		},
		handleAdvertPreview() {},
		handleAdvertRemove(res) {
			for (let i = 0; i < this.uploadAdvertList.length; i++) {
				if (this.uploadAdvertList[i].id == (res.id || res.response.data.id)) {
					this.uploadAdvertList.splice(i, 1);
					break;
				}
			}
			this.hideAdvertUpload = false;
		},
		handleAdvertSuccess(res, file) {
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
			if (imageCnt >= 1 ) {
				this.hideAdvertUpload = true;
			}
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
		initDefaultImage() {
			this.fileList = this.dataForm.files;
			for (let i = 0; i < this.dataForm.files.length; i++) {
				let imageObj = this.dataForm.files[i];
				if (imageObj.groupId == this.dataForm.advertImage) {
					this.uploadAdvertList.push(imageObj);
				}
			}
			if (this.uploadAdvertList.length >= 1) {
				this.hideAdvertUpload = true;
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;
				let fileList = [];
				fileList = fileList.concat(this.uploadAdvertList);
				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				postMethod("/backend/advert/update", this.dataForm).then(
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
			let notNvl = ["advertName", "advertUrl", "sort", "advertLocation"];
			for (let i = 0; i < notNvl.length; i++) {
				if (this.dataForm[notNvl[i]] == "") {
					this.$message({
						message: "字段不能为空",
						type: "warning"
					});
					return false;
				}
			}

			if(this.dataForm.advertLocation.indexOf("http://") != -1
				|| this.dataForm.advertLocation.indexOf("https://") != -1){
				this.$message({
					message: "落地页链接不合法，请以http://或者https://开头",
					type: "warning"
				});
				return 
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
