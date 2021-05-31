<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>门店名称:</td>
						<td>
							<el-input v-model="searchParam.storeName" width="180px"></el-input>
						</td>
            <td>状态:</td>
						<td>
              <el-select v-model="searchParam.enable" placeholder="请选择">
                  <el-option
                    v-for="item in enableList "
                    :key="item.id"
                    :value-key="item.label"
                    :label="item.label"
                    :value="item.id">
                    </el-option>
                </el-select>
						</td>
						<td>门店状态:</td>
						<td>
              <el-select v-model="searchParam.province" placeholder="请选择">
                  <el-option
                    v-for="item in shopStatusList "
                    :key="item.id"
                    :value-key="item.label"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
						</td>
						<td>
							<el-button icon="el-icon-search" @click="search()">搜索</el-button>
							<el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
						</td>
					</tr>
				</table>
			</div>
			<div class="ly-table-panel">
				<div class="ly-data-list">
					<el-table
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%; margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column prop="storeName" label="门店名称" width="150px"></el-table-column>
						<el-table-column prop="owerUserName" label="店主姓名" width="150px"></el-table-column>
						<el-table-column prop="mobilePhone" label="店主手机号" width="150px"></el-table-column>
           				<el-table-column prop="empCnt" label="店员数" width="100px"></el-table-column>
						<el-table-column prop="provinceName" label="省份" width="150px"></el-table-column>
						<el-table-column prop="cityName" label="城市" width="150px"></el-table-column>
            			<el-table-column prop="address" label="详细地址" width="150px"></el-table-column>
            			<el-table-column prop="statusText" label="门店状态" width="100px"></el-table-column>
						<el-table-column prop="enable" label="是否启用" width="150px">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.enable" @change="updateEnable(scope.row)" inactive-value=0 active-value=1  ></el-switch>
							</template>
            			</el-table-column>
						<el-table-column prop="id" label="操作" width="260px">
							<template slot-scope="scope">
								<el-button @click.native.prevent="addOrEdit('edit',scope.$index, tableData)" type="text"	size="small"	>编辑门店</el-button>
								<el-button @click.native.prevent="editEmp(scope.row, tableData)" type="text" size="small"	>编辑店员</el-button>
								<el-button @click.native.prevent="editStoreService(scope.row, tableData)" type="text"	size="small"	>编辑门店服务</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="ly-data-pagination">
					<el-pagination
						background
						v-show="!showPagination"
						layout="prev, pager, next"
						@current-change="currentPage"
						@prev-click="currentPage"
						@next-click="currentPage"
						:total="tableData.total"
					></el-pagination>
				</div>
			</div>
			<div class="list-panel"></div>
		</div>
		<saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
    <empIndex v-if="showEditEmp" :storeData="storeData" @backToStoreIndex="backToStoreIndex"></empIndex>
    <addStoreService v-if="showStoreService" :storeData="storeData"  @backToStoreIndex="backToStoreIndex" ></addStoreService>
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import addStoreService from "./addStoreService";
import empIndex from "./emp/index";
import { getMethod, postMethod } from "@/api/request";

export default {
	computed: {},
	mounted() {
    this.initLoad();

    this.shopStatusList.push({
      id:'0',
      label:'全部'
    })

    this.enableList.push({
      id:'0',
      label:'全部'
    })

    this.shopStatusList = this.shopStatusList.concat(this.GLOBAL.shopStatusList)
    this.enableList = this.enableList.concat(this.GLOBAL.enableList)
	},
	components: { saveOrEdit, empIndex, addStoreService},
	created() {},
	data() {
		return {
      storeData:{},
      shopStatusList:[],
      enableList:[],
			showList: true,
      showAddOrEdit: false,
      showEditEmp: false,
      showStoreService: false,
			showPagination: false,
			editData: {},
			searchParam: {
				typeName: "",
				pageSize: 10,
				pageNum: 0
			},
			tableData: {
				list: []
			},
			dataList: []
		};
	},
	methods: {
    updateEnable(rowObj){
			let param = {
				id:rowObj.id,
				enable:rowObj.enable
			}
			postMethod("/backend/storeManage/update", param).then(
				res => {}
			);
		},
		deleteRow(rowIndex, data) {
			let param = {
				id: data.list[rowIndex].id
			};
			this.$confirm("是否继续删除操作?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				postMethod("/backend/storeManage/delete", param).then(res => {
					this.loadList();
					this.$message("删除成功");
				});
			});
		},
		batchDeleteRow(rowIndex, data) {
			let selectList = this.$refs.mainTable.selection;
			let idArr = [];
			for (let i = 0; i < selectList.length; i++) {
				idArr.push(selectList[i].id);
			}
			let param = {
				delType: "2",
				ids: idArr.join(",")
			};
			postMethod("/backend/storeManage/delete", param).then(res => {
				scope.editData = res.data[0];
				this.showList = false;
				this.showAddOrEdit = true;
				this.$message({
					message: "删除成功",
					type: "success"
				});
			});
			this.searchParam.pageSize = 10;
			this.searchParam.pageNum = 0;
			this.loadList();
		},
		search() {
			this.loadList();
		},
		addOrEdit(oper, rowIndex, data) {
			let scope = this;

			if (oper == "edit") {
				let param = {
					id: data.list[rowIndex].id
				};
				getMethod("/backend/storeManage/findObject", param).then(
					res => {
						scope.editData = res.data[0];
						this.showList = false;
						this.showAddOrEdit = true;
					}
				);
			} else {
				scope.editData = {};
				this.showList = false;
				this.showAddOrEdit = true;
			}
		},
		showListPanel(isCancel) {
			this.showList = true;
			this.showAddOrEdit = false;
			this.loadList();
    },
    backToStoreIndex(){
      this.showList = true
      this.showEditEmp = false
      this.showStoreService = false
      this.loadList()
    },
		currentPage(pageNum) {
			this.searchParam.pageNum = pageNum;
			this.loadList();
		},
		initLoad() {
			this.loadList();
		},
		loadList() {
			let scope = this;
			getMethod("/backend/storeManage/findPage", this.searchParam).then(
				res => {
          scope.tableData = res.data;
          let dataList = scope.tableData.list
          for(let i = 0 ; i < dataList.length ; i++){
            dataList[i].statusText = this.GLOBAL.shopStatusMap[dataList[i].status]
          }
					scope.showPagination = scope.tableData.total == 0;
				}
			);
    },
    editEmp(rowData,tableData){
      this.storeData = rowData
      this.showList = false
      this.showEditEmp = true
    },
    editStoreService(rowData,tableData){
      this.storeData = rowData
      this.showList = false
      this.showStoreService = true
    }
	}
};
</script>
<style lang="scss" scoped>
.ly-container {
	padding: 10px 20px;
	font-size: 14px;
	.ly-tool-panel {
		div {
			display: inline;
		}
		line-height: "60px";
		height: "60px";
		width: 100%;
		padding: 10px 10px;
		.ly-tool-btn {
			padding-left: 20px;
			display: inline;
		}
	}
}
</style>
