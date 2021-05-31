<template>
	<div>
		<div v-if="showList" class="ly-container" v-show="false">
			<div class="ly-tool-panel">
				<table>
					<tr>
						<td>商品名称:</td>
						<td>
							<el-input v-model="searchParam.goodName" width="180px" />
						</td>
						<td>货号:</td>
						<td>
							<el-input v-model="searchParam.goodCode" width="180px" />
						</td>
						<td>
							<el-button icon="el-icon-search" @click="search()">搜索</el-button>
							<el-button plain type="primary" icon="el-icon-document-add" @click="addOrEdit('add')">新建</el-button>
							<el-button plain type="warning" icon="el-icon-delete" @click="batchDeleteRow()">批量删除</el-button>
						</td>
					</tr>
				</table>
			</div>
			<div class="ly-table-panel">
				<div class="ly-data-list">
					<el-table
 						v-loading="loading"					
						ref="mainTable"
						:data="tableData.list"
						style="width: 100%; margin-bottom: 20px;"
						row-key="id"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column type="selection" width="55" />

						<el-table-column prop="goodName" label="商品名称" width="150px" />
						<el-table-column prop="goodMerit" label="商品卖点" width="150px" />
						<el-table-column prop="primeCost" label="成本价" width="150px" />
						<el-table-column prop="packageCost" label="包装成本" width="150px" />
						<el-table-column prop="processCost" label="加工成本" width="150px" />
						<el-table-column prop="expressCost" label="物流成本" width="150px" />
						<el-table-column prop="profit" label="利润" width="150px" />
						<el-table-column prop="goodCode" label="商品名称" width="150px" />
						<el-table-column prop="typeId" label="一级分类" width="150px" />
						<el-table-column prop="typeId2" label="二级分类" width="150px" />
						<el-table-column prop="typeId" label="一级分类" width="150px" />
						<el-table-column prop="goodBrand" label="商品品牌" width="150px" />

						<el-table-column prop="id" label="操作" width="200px">
							<template slot-scope="scope">
								<el-button
									type="text"
									size="small"
									@click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
								>编辑</el-button>
								<el-button
									type="text"
									size="small"
									@click.native.prevent="deleteRow(scope.$index, tableData)"
								>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="ly-data-pagination">
					<el-pagination
						v-show="!showPagination"
						background
						layout="prev, pager, next"
						:total="tableData.total"
						@current-change="currentPage"
						@prev-click="currentPage"
						@next-click="currentPage"
					/>
				</div>
			</div>
			<div class="list-panel" />
		</div>
		<saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :isGift="0" @showListPanel="showListPanel" />
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";

export default {
	components: { saveOrEdit },
	data() {
		return {
			loading:false,
			typeIdList: [],
			typeId2List: [],
			typeIdList: [],
			goodBrandList: [],
			showList: false,
			showAddOrEdit: true,
			showPagination: false,
			editData: {},
			isGift:'0',
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
	props:{
		giftStatus:{
			type:String,
			required:false,
			default:'1'
		}
	},
	computed: {},
	mounted() {
		this.isGift = 0
		this.initLoad();
		this.loadtypeIdList();
	},
	created() {},
	methods: {
		loadtypeIdList() {
      		let scope = this
			let param = {
				parentId: "-1"
			};
			getMethod("/bu/good/findType", param).then(res => {
				scope.typeIdList = res.data.list;
			});
		},
		deleteRow(rowIndex, data) {
			const param = {
				id: data.list[rowIndex].id
			};
			this.$confirm("是否继续删除操作?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				postMethod("/bu/good/delete", param).then(res => {
					this.loadList();
					this.$message("删除成功");
				});
			});
		},
		batchDeleteRow(rowIndex, data) {
			const selectList = this.$refs.mainTable.selection;
			const idArr = [];
			for (let i = 0; i < selectList.length; i++) {
				idArr.push(selectList[i].id);
			}
			const param = {
				delType: "2",
				ids: idArr.join(",")
			};
			postMethod("/bu/good/delete", param).then(res => {
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

			const scope = this;
			this.loading = true
			if (oper == "edit") {
				const param = {
					id: data.list[rowIndex].id
				};
				getMethod("/bu/good/findObject", param).then(res => {
					this.loading = false
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
			this.$nextTick(()=>{
				this.showList = false;
				this.showAddOrEdit = true;
			})
			
			this.loadList();
			this.loading = false
		},
		currentPage(pageNum) {
			this.searchParam.pageNum = pageNum;
			this.loadList();
		},
		initLoad() {
			this.loadList();
		},
		loadList() {
			const scope = this;
			getMethod("/bu/good/findPage?isGift=0", this.searchParam).then(res => {
				scope.tableData = res.data;
				scope.showPagination = scope.tableData.total == 0;
				this.loading = false
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
