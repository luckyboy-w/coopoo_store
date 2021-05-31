<template>
	<div>
		<div class="ly-container" v-if="showList">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>推送类型:</td>
						<td>
							<el-select v-model="searchParam.pushType">
                                <el-option
                                    v-for="item in pushTypeList"
                                    :key="item.id"
                                    :value-key="item.label"
                                    :label="item.label"
                                    :value="item.id"
                                ></el-option>
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
						style="width: 100%;margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					>
						<el-table-column type="selection" width="55"></el-table-column>

						<el-table-column prop="pushType" label="推送类型" width="150px"></el-table-column>
						<el-table-column prop="infoTitle" label="推送标题" width="150px"></el-table-column>
						<el-table-column prop="infoContent" label="推送内容" width="600px"></el-table-column>


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

export default {
	computed: {},
	mounted() {
        this.initLoad();
        this.pushTypeList.push({
            id:'0',
            label:'全部'
        });
        this.pushTypeList = this.pushTypeList.concat(this.GLOBAL.pushTypeList)
	},
	components: { saveOrEdit },
	created() {},
	data() {
		return {
            pushTypeList: [],
			showList: true,
			showAddOrEdit: false,
			showPagination: false,
			editData: {},
			searchParam: {
				pushType: "",
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
				postMethod("/backend/push/delete", param).then(res => {
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
			postMethod("/backend/push/delete", param).then(res => {
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
				getMethod("/backend/push/findObject", param).then(res => {
					scope.editData = res.data[0];
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
            if(this.searchParam.pushType == '0'){
                this.searchParam.pushType = null
            }
			getMethod("/backend/push/findPage", this.searchParam).then(res => {
                scope.tableData = res.data;
                let dataList = scope.tableData.list
                for(let i = 0 ; i < dataList.length ; i++){
                    dataList[i].pushType = this.GLOBAL.pushTypeMap[dataList[i].pushType]
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
