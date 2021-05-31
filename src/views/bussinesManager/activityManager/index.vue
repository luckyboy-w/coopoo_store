<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>活动名称:</td>
						<td>
							<el-input v-model="searchParam.activityName" width="180px"></el-input>
						</td>
						<td>状态:</td>
						<td>
							<el-input v-model="searchParam.enable" width="180px"></el-input>
						</td>
						<td>
							<el-button icon="el-icon-search" @click="search()">搜索</el-button>
							<el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
							<el-button plain type="warning" @click="batchDeleteRow()" icon="el-icon-delete">批量删除</el-button>
						</td>
					</tr>
				</table>
			</div>
			<div class="ly-table-panel">
				<div class="ly-data-list">
					<el-table
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%;margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column type="selection" width="55"></el-table-column>

						<el-table-column prop="activityName" label="活动名称" width="150px"></el-table-column>
						<el-table-column prop="activityName" label="活动主图" width="400px">
							<template slot-scope="scope">
								<img v-for="(item,i) in scope.row.files" :key="item.url" width="300px" height="180px" :src="item.url" />
							</template>
						</el-table-column>

						<el-table-column prop="startTime" label="开始时间" width="150px"></el-table-column>
						<el-table-column prop="endTime" label="结束时间" width="150px"></el-table-column>
						<el-table-column prop="activityCost" label="报名靠谱豆" width="150px"></el-table-column>
						<el-table-column prop="" label="报名人数" width="150px"></el-table-column>
						<el-table-column prop="" label="已兑换靠谱豆" width="150px"></el-table-column>
						<el-table-column prop="enable" label="活动状态" width="150px">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.enable" @change="updateEnable(scope.row)" inactive-value="0" active-value="1"></el-switch>
							</template>
						</el-table-column>

						<el-table-column prop="id" label="操作" width="120px">
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
		<saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";
import {qEditor} from "@/components/RichText/quill-editor"

export default {
	computed: {},
	mounted() {
		this.initLoad();
	},
	components: { saveOrEdit },
	created() {},
	data() {
		return {
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			searchParam: {
                activityName: "",
                enable:"",
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
		deleteRow(rowIndex, data) {
			let param = {
				id: data.list[rowIndex].id
			};
			this.$confirm("是否继续删除操作?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				postMethod("/backend/activityManager/delete", param).then(res => {
					this.loadList();
					this.$message.alert("删除成功");
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
			postMethod("/backend/activityManager/delete", param).then(res => {
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
		updateEnable(rowObj){

			let param = {
				id:rowObj.id,
				enable:rowObj.enable
			}

			postMethod("/backend/activityManager/updateObject", param).then(
				res => {
					
				}
			);
		},
		addOrEdit(oper, rowIndex, data) {
			let scope = this;

			if (oper == "edit") {
				let param = {
					id: data.list[rowIndex].id
				};
				getMethod("/backend/activityManager/findObject", param).then(
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
		currentPage(pageNum) {
			this.searchParam.pageNum = pageNum;
			this.loadList();
		},
		initLoad() {
			this.loadList();
		},
		loadList() {
			let scope = this;
			getMethod("/backend/activityManager/findPage",this.searchParam).then(res => {
				scope.tableData = res.data;
				let dataList = scope.tableData.list
				for(let i = 0 ; i < dataList.length ;i++){
					let rowObj = dataList[i]
					rowObj.startTime = new Date(rowObj.startTime).Format('yyyy-MM-dd')
					rowObj.endTime = new Date(rowObj.endTime).Format('yyyy-MM-dd')
				}
				scope.showPagination = scope.tableData.total == 0;
			});
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
