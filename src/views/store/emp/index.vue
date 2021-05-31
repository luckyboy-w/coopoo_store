<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<!-- <td>店员名称:</td>
						<td>
							<el-input v-model="searchParam.empName" width="180px"></el-input>
						</td>
						<td>手机号码:</td>
						<td>
							<el-input v-model="searchParam.mobilePhone" width="180px"></el-input>
						</td> -->
						<td>
							<!-- <el-button icon="el-icon-search" @click="search()">搜索</el-button> -->
							<el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
							<el-button plain type="success" @click="backStoreIndex()" icon="el-icon-back">返回门店</el-button>
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
						<el-table-column type="selection" width="55"></el-table-column>

						<el-table-column prop="empName" label="店员名称" width="150px"></el-table-column>
						<el-table-column prop="mobilePhone" label="手机号码" width="150px"></el-table-column>
						<el-table-column prop="id" label="操作" width="200px">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.enable" @change="updateEnable(scope.row)" inactive-value="0" active-value="1"></el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="id" label="操作" width="200px">
							<template slot-scope="scope">
								<el-button
									@click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
									type="text"
									size="small"
								>编辑</el-button>
								<el-button
									@click.native.prevent="deleteRow(scope.$index, tableData)"
									type="text"
									size="small"
								>删除</el-button>
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
		<saveOrEdit v-if="showAddOrEdit" :storeId="storeId" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";

export default {
	computed: {},
	mounted() {
        this.storeId = this.storeData.id
		this.initLoad();
	},
	props: {
		storeData: {
			type: Object,
			required: true
		}
	},
	components: { saveOrEdit },
	created() {},
	data() {
		return {
            storeId:'',
			showList: true,
			showAddOrEdit: false,
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
			postMethod("/backend/storeEmp/update", param).then(
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
				postMethod("/backend/storeEmp/delete", param).then(res => {
					this.loadList();
					this.$message("删除成功");
				});
			});
		},
		backStoreIndex() {
			this.$emit("backToStoreIndex", true);
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
				getMethod("/backend/storeEmp/findObject", param).then(res => {
					scope.editData = res.data[0];
					scope.editData.storeId = this.storeData.id;
					this.showList = false;
					this.showAddOrEdit = true;
				});
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
		currentPage(pageNum) {
			this.searchParam.pageNum = pageNum;
			this.loadList();
		},
		initLoad() {
			this.loadList();
		},
		loadList() {
			let scope = this;
			getMethod("/backend/storeEmp/findPage", this.searchParam).then(
				res => {
					scope.tableData = res.data;
					scope.showPagination = scope.tableData.total == 0;
				}
			);
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
