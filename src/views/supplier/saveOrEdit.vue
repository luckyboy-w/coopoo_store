<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="120px">
			<el-form-item label="供应商名称">
				<el-input v-model="dataForm.supplierName"></el-input>
			</el-form-item>
			<el-form-item label="登陆账号">
				<el-input v-model="dataForm.loginNo"></el-input>
			</el-form-item>
			<el-form-item label="联系人">
				<el-input v-model="dataForm.linkPerson"></el-input>
			</el-form-item>
			<el-form-item label="详细地址">
				<el-input v-model="dataForm.address"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="dataForm.mobileNo"></el-input>
			</el-form-item>
			<el-form-item label="联系电话">
				<el-input v-model="dataForm.phoneNo"></el-input>
			</el-form-item>
			<el-form-item label="主营分类">
				<el-select v-model="dataForm.goodType">
					<el-option
						v-for="item in goodTypeList"
						:key="item.id"
						:value-key="item.typeName"
						:label="item.typeName"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="主营品牌">
				<el-select v-model="dataForm.goodBrand">
					<el-option
						v-for="item in goodBrandList"
						:key="item.id"
						:value-key="item.brandName"
						:label="item.brandName"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="省份">
				<el-select v-model="dataForm.province">
					<el-option
						v-for="item in provinceList"
						:key="item.provinceid"
						:value-key="item.province"
						:label="item.province"
						:value="item.provinceid"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="营业执照照片">
				<el-input v-show="false" v-model="dataForm.licenseImg"></el-input>
				<el-upload
					:action="uploadLicenseImgUrl"
					list-type="picture-card"
					:on-preview="handleLicenseImgPreview"
					:before-upload="beforeLicenseImgUpload"
					:on-success="handleLicenseImgSuccess"
					:class="{hide:hideLicenseImgUpload}"
					:file-list="uploadLicenseImgList"
					:on-remove="handleLicenseImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="法人身份证正面">
				<el-input v-show="false" v-model="dataForm.personNoFrontImg"></el-input>
				<el-upload
					:action="uploadPersonNoFrontImgUrl"
					list-type="picture-card"
					:on-preview="handlePersonNoFrontImgPreview"
					:before-upload="beforePersonNoFrontImgUpload"
					:on-success="handlePersonNoFrontImgSuccess"
					:class="{hide:hidePersonNoFrontImgUpload}"
					:file-list="uploadPersonNoFrontImgList"
					:on-remove="handlePersonNoFrontImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="法人身份证背面">
				<el-input v-show="false" v-model="dataForm.personNoSideImg"></el-input>
				<el-upload
					:action="uploadpersonNoSideImgUrl"
					list-type="picture-card"
					:on-preview="handlepersonNoSideImgPreview"
					:before-upload="beforepersonNoSideImgUpload"
					:on-success="handlepersonNoSideImgSuccess"
					:class="{hide:hidepersonNoSideImgUpload}"
					:file-list="uploadpersonNoSideImgList"
					:on-remove="handlepersonNoSideImgRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="协议文件">
				<el-input v-show="false"  v-model="dataForm.protocalFile"></el-input>
				<el-upload
					:action="uploadProtocalFileUrl"
					list-type="text"
					:show-file-list="false"
					:before-upload="beforeProtocalFileUpload"
					:on-success="handleProtocalFileSuccess"
					:file-list="uploadProtocalFileList"
					:on-remove="handleProtocalFileRemove">
					<el-button size="small" v-show="hideProtocalFileUpload" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过5mb</div>
				</el-upload>
				<ul class="el-upload-list el-upload-list--text">
					<li
						v-for="(item,index) in uploadProtocalFileList"
						:key="index"
						tabindex="0"
						class="el-upload-list__item is-success el-list-enter-to"
					>
						<!---->
						<a class="el-upload-list__item-name" @click="downlandFile(item)">
							<i class="el-icon-document"></i>11.pdf
						</a>
						<label class="el-upload-list__item-status-label">
							<i
								class="el-icon-upload-success el-icon-circle-check"
								@click="handleProtocalFileRemove(item)"
							></i>
						</label>
						<i class="el-icon-close" @click="handleProtocalFileRemove(item)"></i>
					</li>
				</ul>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
			<el-form-item label="银行名称">
				<el-input v-model="dataForm.bankName"></el-input>
			</el-form-item>
			<el-form-item label="银行卡号">
				<el-input v-model="dataForm.bankCardNo"></el-input>
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
		this.loadgoodTypeList();
		this.loadgoodBrandList();
		this.loadprovinceList();
		this.buildLicenseImgGroupId();
		this.buildPersonNoFrontImgGroupId();
		this.buildpersonNoSideImgGroupId();
		this.buildProtocalFileGroupId();
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
			goodTypeList: [],
			goodBrandList: [],
			provinceList: [],
			uploadLicenseImgList: [],
			hideLicenseImgUpload: false,
			uploadLicenseImgUrl: "",
			uploadPersonNoFrontImgList: [],
			hidePersonNoFrontImgUpload: false,
			uploadPersonNoFrontImgUrl: "",
			uploadpersonNoSideImgList: [],
			hidepersonNoSideImgUpload: false,
			uploadpersonNoSideImgUrl: "",
			uploadProtocalFileList: [],
			hideProtocalFileUpload: true,
			uploadProtocalFileUrl: "",
			ProtocalFileFileList: [],
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				supplierName: "",
				loginNo: "",
				linkPerson: "",
				mobileNo: "",
				phoneNo: "",
				address: "",
				bankName: "",
				bankCardNo: "",
				goodType: "",
				goodBrand: "",
				province: "",
				enable: true,
				licenseImg: "",
				personNoFrontImg: "",
				personNoSideImg: "",
				protocalFile: "",
				id: ""
			}
		};
	},
	methods: {
		loadgoodTypeList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend/goodType/findList", param).then(res => {
				scope.goodTypeList = res.data;
			});
		},
		loadgoodBrandList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend/goodBrand/findList", param).then(res => {
				scope.goodBrandList = res.data;
			});
		},
		loadprovinceList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend//areas/findProvince", param).then(res => {
				scope.provinceList = res.data;
			});
		},
		buildLicenseImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadLicenseImgUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.licenseImg = this.dataForm.licenseImg || res.data;
			});
		},
		handleLicenseImgPreview() {},
		handleLicenseImgRemove(res) {
			for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
				if (
					this.uploadLicenseImgList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadLicenseImgList.splice(i, 1);
					break;
				}
			}
			this.hideLicenseImgUpload = false;
		},
		handleLicenseImgSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadLicenseImgList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadLicenseImgList.length; i++) {
				if (this.uploadLicenseImgList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 1) {
				this.hideLicenseImgUpload = true;
			}
		},
		beforeLicenseImgUpload(file) {
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
		buildPersonNoFrontImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadPersonNoFrontImgUrl = getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.personNoFrontImg = this.dataForm.personNoFrontImg || res.data;
			});
		},
		handlePersonNoFrontImgPreview() {},
		handlePersonNoFrontImgRemove(res) {
			for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
				if (
					this.uploadPersonNoFrontImgList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadPersonNoFrontImgList.splice(i, 1);
					break;
				}
			}
			this.hidePersonNoFrontImgUpload = false;
		},
		handlePersonNoFrontImgSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadPersonNoFrontImgList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadPersonNoFrontImgList.length; i++) {
				if (this.uploadPersonNoFrontImgList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 1) {
				this.hidePersonNoFrontImgUpload = true;
			}
		},
		beforePersonNoFrontImgUpload(file) {
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
		buildpersonNoSideImgGroupId() {
			getMethod("/backend/oss/groupId", null).then(res => {
				this.uploadpersonNoSideImgUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.personNoSideImg =
					this.dataForm.personNoSideImg || res.data;
			});
		},
		handlepersonNoSideImgPreview() {},
		handlepersonNoSideImgRemove(res) {
			for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
				if (
					this.uploadpersonNoSideImgList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadpersonNoSideImgList.splice(i, 1);
					break;
				}
			}
			this.hidepersonNoSideImgUpload = false;
		},
		handlepersonNoSideImgSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadpersonNoSideImgList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadpersonNoSideImgList.length; i++) {
				if (this.uploadpersonNoSideImgList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 1) {
				this.hidepersonNoSideImgUpload = true;
			}
		},
		beforepersonNoSideImgUpload(file) {
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
		buildProtocalFileGroupId() {
			if (this.dataForm.protocalFile == "") {
				getMethod("/backend/oss/groupId", null).then(res => {
					this.uploadProtocalFileUrl =
						getUploadUrl() + "?groupId=" + res.data;
					this.dataForm.protocalFile =
						this.dataForm.protocalFile || res.data;
				});
			} else {
				this.uploadProtocalFileUrl =
					getUploadUrl() + "?groupId=" + this.dataForm.protocalFile;
			}
		},
		handleProtocalFilePreview() {},
		handleProtocalFileRemove(res) {
			for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
				if (
					this.uploadProtocalFileList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadProtocalFileList.splice(i, 1);
					break;
				}
			}
			this.hideProtocalFileUpload = false;
		},
		handleProtocalFileSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			res.data.name = file.name;
			this.uploadProtocalFileList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadProtocalFileList.length; i++) {
				if (this.uploadProtocalFileList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 2) {
				this.hideProtocalFileUpload = true;
			}
		},
		beforeProtocalFileUpload(file) {
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
				if (imageObj.groupId == this.dataForm.licenseImg) {
					this.uploadLicenseImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.personNoFrontImg) {
					this.uploadPersonNoFrontImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.personNoSideImg) {
					this.uploadpersonNoSideImgList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.protocalFile) {
					this.uploadProtocalFileList.push(imageObj);
				}
			}
			if (this.uploadLicenseImgList.length >= 1) {
				this.hideLicenseImgUpload = true;
			}

			if (this.uploadPersonNoFrontImgList.length >= 1) {
				this.hidePersonNoFrontImgUpload = true;
			}

			if (this.uploadpersonNoSideImgList.length >= 1) {
				this.hidepersonNoSideImgUpload = true;
			}

			if (this.uploadProtocalFileList.length >= 1) {
				this.hideProtocalFileUpload = true;
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];
				fileList = fileList.concat(this.uploadLicenseImgList);
				fileList = fileList.concat(this.uploadPersonNoFrontImgList);
				fileList = fileList.concat(this.uploadpersonNoSideImgList);
				fileList = fileList.concat(this.uploadProtocalFileList);
				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				postMethod("/backend/supplier/update", this.dataForm).then(
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
			let notNvl = [
				"supplierName",
				"loginNo",
				"linkPerson",
				"mobileNo",
				"phoneNo",
				"address",
				"bankName",
				"bankCardNo"
			];
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
