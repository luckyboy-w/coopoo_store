<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div style="display: flex;align-items: center;margin:0 0 10px 10px;">
        公告标题：
        <div>
          <el-input placeholder="请输入" v-model="searchParam.title" clearable />
        </div>
        <div style="margin-left: 20px;">
          <el-button plain type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        </div>
      </div>
      <div class="ly-tool-panel">
        <el-button  type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">发布</el-button>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%;margin-bottom: 20px;" row-key="id" border
            default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="title" label="公告标题" width="250px"></el-table-column>
            <!-- <el-table-column prop="infoContent" label="推送内容" width="600px"></el-table-column> -->
            <el-table-column prop="createTime" label="发布时间" width="150px">
              <template slot-scope="scope">
                {{scope.row.createTime | fmtDateStr}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="600px">
              <template slot-scope="scope">
                <el-button @click="addOrEdit('edit',scope.$index, tableData)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" @next-click="currentPage" :total="tableData.total"></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
  import saveOrEdit from "./saveOrEdit";
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    computed: {},
    mounted() {
      this.initLoad();
    },
    components: {
      saveOrEdit
    },
    created() {},
    filters: {
      fmtDateStr(val) {
        let dt = new Date(val);
        return formatDate(dt, 'yyyy-MM-dd hh:mm');
      }
    },
    data() {
      return {
        pushTypeList: [],
        showList: true,
        showAddOrEdit: false,
        showPagination: false,
        editData: {},
        searchParam: {
          title:'',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        dataList: []
      };
    },
    methods: {
      search() {
        this.searchParam.pageNum = 1;
        this.loadList();
      },
      addOrEdit(oper, rowIndex, data) {
        let scope = this;
        if (oper == "edit") {
          let param = {
            id: data.list[rowIndex].id
          };
          getMethod("/msg/get-active-info", param).then(res => {
            scope.editData = res.data;
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
        getMethod("/msg/search-active-list", this.searchParam).then(res => {
          scope.tableData.list = res.data.records;
          scope.tableData.total = res.data.total;
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
