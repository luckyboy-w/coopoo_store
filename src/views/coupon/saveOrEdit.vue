<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="80px">

			<el-form-item label="优惠券编号" v-show="false">
				<el-input v-model="dataForm.couponNo"></el-input>
			</el-form-item>

			<el-form-item label="礼券名称">
				<el-input v-model="dataForm.couponName"></el-input>
			</el-form-item>
            <el-form-item label="礼券卖点">
                <el-input v-model="dataForm.couponMerit"></el-input>
            </el-form-item>
            <el-form-item label="礼券品牌">
                <el-input v-model="dataForm.couponBrand"></el-input>
            </el-form-item>
            <el-form-item label="售卖价格" >
				<el-input v-model="dataForm.price"  ></el-input>
			</el-form-item>
			<el-form-item label="抵扣金额" v-show="false">
				<el-input v-model="dataForm.couponValue"></el-input>
			</el-form-item>
			<el-form-item label="使用条件">
				<el-row>
					<el-col>
						购物满 <el-input v-model="dataForm.couponCondition"  style="width:60px;"></el-input>元，
						可以抵扣 <el-input v-model="dataForm.couponValue"  style="width:60px;"></el-input>元
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="优惠券类型" v-show="false">
				<el-input v-model="dataForm.couponType"></el-input>
			</el-form-item>
			<el-form-item label="优惠券发放数量" v-show="false">
				<el-input v-model="dataForm.couponNum"></el-input>
			</el-form-item>
			<el-form-item label="是否礼品券" v-show="false">
				<el-input v-model="dataForm.isGift"></el-input>
			</el-form-item>
			<el-form-item label="缩略图">
				<el-input v-show="false" v-model="dataForm.frontImage"></el-input>
				<el-upload
					:action="uploadFrontImageUrl"
					list-type="picture-card"
					:on-preview="handleFrontImagePreview"
					:before-upload="beforeFrontImageUpload"
					:on-success="handleFrontImageSuccess"
					:file-list="uploadFrontImageList"
					:on-remove="handleFrontImageRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
			<el-form-item label="内容图片">
				<el-input v-show="false" v-model="dataForm.couponImage"></el-input>
				<el-upload
					:action="uploadCouponImageUrl"
					list-type="picture-card"
					:on-preview="handleCouponImagePreview"
					:before-upload="beforeCouponImageUpload"
					:on-success="handleCouponImageSuccess"
					:file-list="uploadCouponImageList"
					:on-remove="handleCouponImageRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog>
					<img width="100%" :src="imageUrl" alt />
				</el-dialog>
			</el-form-item>
      <el-form-item label="礼券描述">
        <qEditor
          :content="dataForm.detailContent"
          ref="refEditor"
          moduleName="dtlName"
          @changeContent="changeContent"
        ></qEditor>
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
  computed: {},
  components: { qEditor },
	mounted() {
		this.dataForm.isGift = "1"
		this.buildFrontImageGroupId();
		this.buildCouponImageGroupId();
		this.$nextTick(function() {
			if (this.editData.id) {
        this.dataForm = this.editData;
        this.$refs.refEditor.richText = this.editData.detailContent
				this.initDefaultImage();
			}
		});
	},
	created() {},
	props: {
		editData: {
			type: Object,
			required: false
		},
		isGift:{
			type:String,
			required:true
		}
	},
	data() {
		return {
      dtlName:'couponName',
			uploadFrontImageList: [],
			hideFrontImageUpload: false,
			uploadFrontImageUrl: "",
			uploadCouponImageList: [],
			hideCouponImageUpload: false,
			uploadCouponImageUrl: "",
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				couponNo: "NO"+(new Date()).getTime(),
                couponName: "",
                price:"",
                couponMerit: "",
                couponBrand: "",
				couponValue: "",
				couponCondition: "",
				couponType: "3",
				couponNum: "2147483647",
				isGift: "1",
				frontImage: "",
				couponImage: "",
				id: ""
			}
		};
	},
	methods: {
		buildFrontImageGroupId() {
			getMethod("/bu/oss/groupId", null).then(res => {
				this.uploadFrontImageUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.frontImage = this.dataForm.frontImage || res.data;
			});
		},
		handleFrontImagePreview() {},
		handleFrontImageRemove(res) {
			for (let i = 0; i < this.uploadFrontImageList.length; i++) {
				if (
					this.uploadFrontImageList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadFrontImageList.splice(i, 1);
					break;
				}
			}
			this.hideFrontImageUpload = false;
		},
		handleFrontImageSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadFrontImageList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadFrontImageList.length; i++) {
				if (this.uploadFrontImageList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 5) {
				this.hideFrontImageUpload = true;
			}
		},
		beforeFrontImageUpload(file) {
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
		buildCouponImageGroupId() {
			getMethod("/bu/oss/groupId", null).then(res => {
				this.uploadCouponImageUrl =
					getUploadUrl() + "?groupId=" + res.data;
				this.dataForm.couponImage =
					this.dataForm.couponImage || res.data;
			});
		},
		handleCouponImagePreview() {},
		handleCouponImageRemove(res) {
			for (let i = 0; i < this.uploadCouponImageList.length; i++) {
				if (
					this.uploadCouponImageList[i].id ==
					(res.id || res.response.data.id)
				) {
					this.uploadCouponImageList.splice(i, 1);
					break;
				}
			}
			this.hideCouponImageUpload = false;
		},
		handleCouponImageSuccess(res, file) {
			res.data.fileType = file.raw.type;
			res.data.sort = this.fileSortImage++;
			this.uploadCouponImageList.push(res.data);
			let groupId = res.data.groupId;
			let imageCnt = 0;
			for (let i = 0; i < this.uploadCouponImageList.length; i++) {
				if (this.uploadCouponImageList[i].groupId == groupId) {
					imageCnt++;
				}
			}
			if (imageCnt >= 5) {
				this.hideCouponImageUpload = true;
			}
		},
		beforeCouponImageUpload(file) {
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
				if (imageObj.groupId == this.dataForm.frontImage) {
					this.uploadFrontImageList.push(imageObj);
				}
				if (imageObj.groupId == this.dataForm.couponImage) {
					this.uploadCouponImageList.push(imageObj);
				}
			}
			if (this.uploadFrontImageList.length >= 1) {
				this.hideFrontImageUpload = true;
			}

			if (this.uploadCouponImageList.length >= 1) {
				this.hideCouponImageUpload = true;
			}
		},
		saveObject() {
			let scope = this;
			if(this.uploadFrontImageList.length == 0){
					this.$message({
						message: "封面图片不能为空",
						type: "warning"
					});
					return false;
			}

			if(this.uploadCouponImageList.length == 0){
					this.$message({
						message: "礼券图片不能为空",
						type: "warning"
					});
					return false;
			}

			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];
				fileList = fileList.concat(this.uploadFrontImageList);
				fileList = fileList.concat(this.uploadCouponImageList);
				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];
				this.dataForm.couponImageFile = []
				this.dataForm.frontImageFile = []
				postMethod("/bu/coupon/update", this.dataForm).then(res => {
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
				"couponNo",
				"couponName",
				"couponValue",
				"couponCondition",
				"couponType",
				"couponNum",
				"isGift"
			];
			for (let i = 0; i < notNvl.length; i++) {
               
				if (this.dataForm[notNvl[i]] == "") {
					this.$message({
						message: "必填字段不能为空",
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
    changeContent(val){
      this.dataForm.detailContent = val
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