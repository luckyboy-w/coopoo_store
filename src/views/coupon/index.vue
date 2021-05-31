<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <!-- <td>优惠券编号</td> -->
            <td>
              <!-- <el-input v-model="searchParam.couponNo" width="180px"></el-input> -->
            </td>
            <td>
              <!-- <el-button icon="el-icon-search" @click="search()">搜索</el-button> -->
              <el-button
                plain
                type="primary"
                @click="addOrEdit('add')"
                icon="el-icon-document-add"
              >新建</el-button>
              <!-- <el-button plain type="warning" @click="batchDeleteRow()" icon="el-icon-delete">批量删除</el-button> -->
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="couponName" label="礼券名称" width="450px"></el-table-column>
            <el-table-column prop="couponValue" label="抵扣金额" width="150px"></el-table-column>
            <el-table-column prop="couponCondition" label="使用条件金额" width="150px"></el-table-column>
            <!-- <el-table-column prop="verifyStatus" label="审核状态" width="150px">
              <template slot-scope="scope">
                {{ scope.verifyText }}
              </template>
            </el-table-column> -->

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
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData" isGift="1"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";

export default {
  computed: {},
  mounted() {
    this.initLoad();
  },
  components: { saveOrEdit },
  created() {},
  data() {
    return {
      couponTypeList: [],
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
    loadcouponTypeList() {
      let scope = this;
      getMethod("/bu/dimenson?dataType=COUPON_TYPE", null).then(
        res => {
          scope.couponTypeList = res.data.list;
        }
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
        postMethod("/bu/coupon/delete", param).then(res => {
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
      postMethod("/bu/coupon/delete", param).then(res => {
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
        getMethod("/bu/coupon/findObject", param).then(res => {
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
      getMethod("/bu/coupon/findPage?isGift=1", this.searchParam).then(res => {
        scope.tableData = res.data;
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
