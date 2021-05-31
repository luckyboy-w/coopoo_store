<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="120px">
			<el-form-item label="门店名称">
				<el-input v-model="dataForm.storeName"></el-input>
			</el-form-item>
			<el-form-item label="店主姓名">
				<el-input v-model="dataForm.owerUserName"></el-input>
			</el-form-item>
			<el-form-item label="店主手机号">
				<el-input v-model="dataForm.mobilePhone"></el-input>
			</el-form-item>

			<el-form-item label="E类服务商">
				<el-select v-model="dataForm.serviceLevel">
					<el-option
						v-for="item in serviceList"
						:key="item.id"
						:value-key="item.label"
						:label="item.label"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="所在城市">
				<el-select v-model="dataForm.province"  @change="changeProvince()" >
					<el-option
						v-for="item in provinceList"
						:key="item.provinceid"
						:value-key="item.province"
						:label="item.province"
						:value="item.provinceid"
					></el-option>
				</el-select>
        		<el-select v-model="dataForm.city">
					<el-option
						v-for="item in cityList"
						:key="item.cityid"
						:value-key="item.city"
						:label="item.city"
						:value="item.cityid"
					></el-option>
				</el-select>
			</el-form-item>
      		<el-form-item label="详细地址">
				<el-input v-model="dataForm.address"></el-input><el-button @click="choiceMap">选择门店</el-button>
			</el-form-item>
			<el-form-item label="门店状态">
				<el-select v-model="dataForm.status">
					<el-option
						v-for="item in shopStatusList"
						:key="item.id"
						:value-key="item.label"
						:label="item.label"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch v-model="dataForm.enable" inactive-value=0 active-value=1 ></el-switch>
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
    this.shopStatusList = this.GLOBAL.shopStatusList
    this.loadprovinceList();
    
		this.$nextTick(function() {
			if (this.editData.id) {
        this.dataForm = this.editData
        this.loadCityList()
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
      serviceList:[
        {id:'1',label:'E类服务商1'},
        {id:'2',label:'E类服务商2'},
        {id:'3',label:'E类服务商3'},
        {id:'4',label:'E类服务商4'}],
      shopStatusList:[],
			provinceList: [],
			cityList: [],
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				storeName: "",
				owerUserName: "",
				mobilePhone: "",
        address: "",
        serviceLevel:'1',
        status:'',
				province: "",
				city: "",
				enable: true,
				id: ""
			}
		};
	},
	methods: {
    changeProvince(val){
      this.loadCityList()
    },
		loadprovinceList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			getMethod("/backend/areas/findProvince", param).then(res => {
				scope.provinceList = res.data;
			});
		},
		loadCityList() {
			let scope = this
      let param = {
        provinceid: this.dataForm.province
      }

      if (this.dataForm.province == '') {
        return
      }
      
			getMethod("/backend/areas/findCity", param).then(res => {
				scope.cityList = res.data;
			});
		},

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

				postMethod("/backend/storeManage/update", this.dataForm).then(
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
				"storeName",
				"owerUserName",
				"mobilePhone",
				"address"
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