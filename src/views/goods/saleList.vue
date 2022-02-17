<template>
  <div>
    <div v-if="!showAddOrEdit" v-loading="isLoading" class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>商品名称：</div>
          <div>
            <el-input v-model="searchParam.goodsName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>物料编码：</div>
          <div>
            <el-input v-model="searchParam.goodsCode" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>供应商名称：</div>
          <div>
            <el-input v-model="searchParam.supplierName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" type="primary" @click="search()">
            搜索
          </el-button>
          <!-- <el-button plain type="normal" icon="el-icon-download" @click="exportData()">
            导出
          </el-button> -->
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="goodsId" border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.skuList" style="width: 100%; margin-bottom: 20px;" row-key="skuId" border>
                  <el-table-column prop="skuText" label="SKU属性" width="260px" />
                  <el-table-column prop="stock" label="库存" width="150px" />
                  <el-table-column prop="marketPrice" label="零售价" width="150px" />
                  <el-table-column prop="supplyPrice" label="供应价" width="150px" />
                  <el-table-column prop="salePrice" label="会员价" width="150px" />
                  <el-table-column prop="goodsCode" label="物料编码" width="150px" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" min-width="300px">
              <template slot-scope="scope">
                <div style="display: flex;flex-wrap: nowrap;align-items: center;line-height: 30px;">
                <div style="min-width: 80px;height: 94px;max-width: 80px;margin-right: 10px;position: relative;">
                  <el-image style="width: 100%;height: 100%;" fit="fill" :src="scope.row.goodsCoverImgUrl"></el-image>
                  <div v-if="scope.row.goodsType==2" style="text-align: center;line-height: 25px; width: 40px;background-color: #409EFF;position: absolute;top: 0;right: 0;color:white;border-radius: 5px;">
                    专属
                  </div>
                </div>
                <div>{{scope.row.goodsName}}</div></div>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.maxGoodsSalePrice?(scope.row.minGoodsSalePrice+'~'+scope.row.maxGoodsSalePrice):scope.row.minGoodsSalePrice}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="saleVolume" label="销量" width="150px" />
           <el-table-column prop="supplierName" label="供应商名称" width="150px" />

            <el-table-column prop="createTime" label="创建时间" width="170px">
              <template slot-scope="scope">
                {{ scope.row.createTime | formatDate }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <div >
                  <!-- <el-button v-if="scope.row.isSale == 0"
                    type="text" size="small" @click.native.prevent="onLine(scope.row)">
                    上架
                  </el-button> -->
                  <!-- <el-button v-if="scope.row.isSale == 1" type="text" size="small"
                    @click.native.prevent="offLine(scope.row)">
                    下架
                  </el-button>
                  <el-divider direction="vertical"></el-divider> -->
                  <el-button v-if="scope.row.isSale == 1" type="text" size="small" @click.native.prevent="editGood(scope.row,true)">
                    详情
                  </el-button>
                  <!-- <el-button v-if="scope.row.isSale == 0" type="text" size="small"
                    @click.native.prevent="editGood(scope.row)">
                    编辑
                  </el-button> -->
                 <!-- <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="small"
                    @click.native.prevent="deleteGoods(scope.row)">
                   删除
                  </el-button> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" :total="tableData.total" background layout="prev, pager, next"
            @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
    </div>

    <saveOrEdit v-if="showAddOrEdit" :is-gift="isGift" :edit-data="editData" :is-edit-good="isEditGood"
      :is-disabled="isDisabled" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate
  } from "@/api/request";
  import saveOrEdit from "./editGood";
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {
      saveOrEdit
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    props: {
      verifyStatus: {
        type: String,
        required: false
      },
      isSale: {
        type: Number,
        required: false
      },
    },
    data() {
      return {
        isDisabled: false,
        supplyList: [],
        isLoading: true,
        showAddOrEdit: false,
        showResult: false,
        dialogVerify: false,
        typeId2List: [],
        typeIdList: [],
        goodBrandList: [],
        showPagination: false,
        editData: {},
        isGift: '1',
        isEditGood: true,
        verifyForm: {
          verifyResult: "0",
          recContent: "",
          verifyType: "GOOD",
          modityStatus: "20",
          dataId: ""
        },
        searchParam: {
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
        },
        dataList: []
      };
    },
    computed: {},
    mounted() {
      this.initLoad()
    },
    created() {},
    methods: {
      exportData() {
        let exportParam = [];
        for (let key in this.searchParam) {
          if (this.searchParam[key] != undefined) {
            exportParam.push(key + "=" + this.searchParam[key]);
          }
        }
        exportParam.push("token=" + getToken())
        window.open(process.env.VUE_APP_BASE_API + '/backend/good/export?' + exportParam.join("&"))
      },
      editGood(row, disabled) {
        let scope = this
        this.isDisabled = disabled == true ? true : false

        let param = {
          goodsId: row.goodsId
        }
        getMethod("/goods/detail", param).then(res => {
          scope.isEditGood = true
          scope.editData = res.data
          this.showAddOrEdit = true
        });
      },
      offLine(row, isSale) {
        getMethod("/goods/off-sale-goods?goodsId="+row.goodsId).then(res => {
          if(res.errCode==0){
              this.$message({
              message: "下架成功",
              type: "success"
            });
            this.loadList()
            }
        });
      },
      onLine(row) {
        getMethod("/goods/on-sale-goods?goodsId="+row.goodsId).then(res => {
          if(res.errCode==0){
              this.$message({
              message: "上架成功",
              type: "success"
            });
            this.loadList()
            }
        });
      },
      deleteGoods(row){
        getMethod("/goods/remove?goodsId="+row.goodsId).then(res => {
          if(res.errCode==0){
            this.$message({
            message: "删除成功",
            type: "success"
          });
          this.loadList()
          }
        });
      },
      search() {
        this.searchParam.pageNum='1'
        this.loadList();
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
        const scope = this;
        if (!scope.isLoading) {
          scope.isLoading = true
        }
        getMethod("/goods/search-goods-list", this.searchParam).then(res => {
          scope.tableData.list = res.data.records;
          scope.tableData.total = res.data.total;
          scope.isLoading = false
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

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
