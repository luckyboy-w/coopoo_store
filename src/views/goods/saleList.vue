<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>商品名称:</td>
            <td>
              <el-input @keyup.enter.native="search()" v-model="searchParam.goodName" width="180px"/>
            </td>
            <td>货号:</td>
            <td>
              <el-input @keyup.enter.native="search()" v-model="searchParam.goodCode" width="180px"/>
            </td>
            <td>商品类型:</td>
            <td>
              <el-select v-model="searchParam.isMarketing" placeholder="请选择">
                <el-option value="" label="全部"/>
                <el-option value="0" label="普通商品"/>
                <el-option value="1" label="活动商品"/>
              </el-select>
            </td>
            <td>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <!--              <el-button plain type="primary" icon="el-icon-add" @click="addOrEdit('add')">新增</el-button>-->
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            row-key="id"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="expand">
              <!--              row-key="id"-->
              <!--              :data="props.row.skuPriceList"-->

              <template slot-scope="props">
                <el-table
                  :data="props.row.tableList"
                  :span-method="objectSpanMethod"
                  border
                >
                  <el-table-column
                    align="center"
                    v-for="(item,index) in props.row.columnList"
                    :key="index"
                    :label="item"
                    width=""
                  >
                    <template slot-scope="scope">
                      {{ scope.row.tdList[index].value }}
                      <!--                  {{ `${index} , ${scope.$index}` }}-->
                    </template>
                  </el-table-column>
                  <el-table-column prop="stock" label="库存"></el-table-column>
                  <el-table-column prop="salePrice" label="零售价"></el-table-column>
                  <el-table-column prop="saleMemPrice" label="会员价"></el-table-column>
<!--                  <el-table-column prop="saleCount" label="销量"></el-table-column>-->
                  <el-table-column prop="goodsCode" label="物料编码"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称"/>
            <el-table-column prop="isMarketing" label="商品类型">
              <template slot-scope="scope">
                <span v-if="scope.row.isMarketing == 0">普通商品</span>
                <span v-if="scope.row.isMarketing == 1">活动商品</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodMerit" label="商品分类">
              <template slot-scope="scope">
                {{ scope.row.typeName }} -> {{ scope.row.typeName2 }}
              </template>
            </el-table-column>
            <el-table-column prop="goodBrand" label="是否推荐">
              <template slot-scope="scope">
                {{ scope.row.recommend == '0' ? '未推荐' : '已推荐' }}
              </template>
            </el-table-column>
            <el-table-column prop="verifyStatus" label="状态">
              <template slot-scope="scope">
                {{ scope.row | parseStatus }}
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="260px" v-if="showOp">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button v-if="scope.row.verifyStatus == 10 || scope.row.verifyStatus == 20 "
                             type="primary" size="mini" @click="addOrEdit('edit',scope.$index, tableData, true)"
                  >查看详情
                  </el-button>
                  <!--5:在仓库;10:待审核;20:已通过;30:被驳回;40:违规下架;-->
                  <el-button v-if="scope.row.verifyStatus == 20" type="primary" size="mini"
                             @click.native.prevent="addStock(scope.row)"
                  >补货
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 5" type="primary" size="mini"
                             @click="modityGood(scope.row,'verifyStatus','10')"
                  >提交审核
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 10" type="primary" size="mini"
                             @click="modityGood(scope.row,'verifyStatus','5')"
                  >取消审核
                  </el-button>
                  <el-button
                    v-if="scope.row.verifyStatus == 30 || scope.row.verifyStatus == 5 || scope.row.isSale == 3 "
                    type="primary" size="mini" @click="addOrEdit('edit',scope.$index, tableData)"
                  >编辑
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 1 " type="primary" size="mini"
                             @click="offLine(scope.row,'3')"
                  >下架
                  </el-button>
                  <el-button v-if="scope.row.isSale == 3"
                             type="primary" size="mini" @click="deleteRow(scope.$index,tableData)"
                  >删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            :total="tableData.total"
            v-show="!showPagination"
            background
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel"/>
    </div>

    <el-dialog title="补货"
               :visible.sync="pushStockBatch" v-if="pushStockBatch" width="1200px"
    >
      <el-row :gutter="20" style="line-height:40px;font-size:14px;padding:0px 0px 20px 0px" v-if="stockType == 1">
        <el-col :span="4">
          库存数量：
        </el-col>
        <el-col :span="4">
          <el-input v-model="stockNum" @keyup.native="syncStockNum"></el-input>
        </el-col>
        <el-col :span="16"></el-col>
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-table
          :data="addStocktableList"
          :span-method="objectSpanMethod"
          border
        >
          <el-table-column
            align="center"
            v-for="(item,index) in addStockcolumnList"
            :key="index"
            :label="item"
            width=""
          >
            <template slot-scope="scope">
              {{ scope.row.tdList[index].value }}
              <!--                  {{ `${index} , ${scope.$index}` }}-->
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" :disabled="stockType == 1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="零售价"></el-table-column>
          <el-table-column prop="saleMemPrice" label="会员价"></el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="8">
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="submitStock()">提交</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="cancelStock()">取消</el-button>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="补货" v-if="pushStock">
      <el-form ref="dataForm" :model="stockForm" label-width="100px">
        <el-form-item label="库存数量">

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitStock()">提交</el-button>
          <el-button @click="cancelStock()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :isGift="isGift" :isHiddenEditGood="isHiddenEditGood"
                @showListPanel="showListPanel"
    />
  </div>
</template>

<script>
import saveOrEdit from './publish/saveOrEdit'
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import { deepCopy } from '@/utils/util'

export default {
  components: {
    saveOrEdit
  },
  data() {
    return {
      isHiddenEditGood: true,
      stockType: '',
      stockNum: '',
      showOp: true,
      showList: true,
      showAddOrEdit: false,
      pushStockBatch: false,
      pushStock: false,
      typeIdList: [],
      typeId2List: [],
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        typeName: '',
        pageSize: 10,
        pageNum: 0,
        verifyStatus: '20',
        isSale: '1'
      },
      tableData: {
        list: []
      },

      addStockList: [],
      addStockcolumnList: [],
      addStocktableList: []
    }
  },
  props: {
    dataSource: {
      type: String,
      required: false
    },
    goodStatus: {
      type: Object,
      required: false
    },
    giftStatus: {
      type: String,
      required: false,
      default: '1'
    }
  },
  computed: {},
  mounted() {
    if (this.dataSource != undefined) {
      this.searchParam.verifyStatus = this.goodStatus.verifyStatus
      this.searchParam.isSale = this.goodStatus.isSale
    }
    if (this.verifyStatus == '10') {
      this.showOp = false
    }
    this.isGift = this.giftStatus
    this.initLoad()
  },
  filters: {
    _formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    parseStatus(row) {
      let verifyStatus = row.verifyStatus
      //审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 5) {
        return '待提交审核'
      } else if (verifyStatus == 10) {
        return '待审核'
      } else if (verifyStatus == 30) {
        return '被驳回'
      } else if (verifyStatus == 40) {
        return '违规下架'
      } else {
        return '已通过'
      }
    }
  },
  created() {
  },
  methods: {
    syncStockNum() {
      if (isNaN(this.stockNum)) {
        this.$message.warning('库存数量输入有误')
        return
      }

      if (this.stockNum < 0) {
        this.$message.warning('库存不能为负数')
        return
      }

      for (let i = 0; i < this.addStockList.length; i++) {
        this.addStockList[i].stock = this.stockNum
      }
    },
    async submitStock() {
      let param = {
        stockType: this.stockType,
        skuPriceList: this.addStocktableList
      }
      for (let i = 0; i < this.addStocktableList.length; i++) {
        let rowObj = this.addStocktableList[i]
        if (rowObj.stock == '') {
          this.$message.warning('库存不能为空')
          return
        }
        if (isNaN(rowObj.stock)) {
          this.$message.warning('库存输入有误')
          return
        }

        if (rowObj.stock < 0) {
          this.$message.warning('库存不能为负数')
          return
        }

        if ((rowObj.stock + '').indexOf('.') != -1) {
          this.$message.warning('库存不能是小数')
          return
        }
      }

      await postMethod('/bu/good/modityGoodStock', param)

      this.$message.success('补货成功')
      this.cancelStock()
      this.loadList()
    },
    cancelStock() {
      this.pushStockBatch = false
      this.pushStock = false
    },
    addStock(row, rowIndex) {
      this.stockType = row.stockType
      this.addStockList = row.skuPriceList
      this.addStocktableList = row.tableList
      this.addStockcolumnList = row.columnList

      //1:全局配置;2:局部配置
      this.pushStockBatch = true
    },
    loadtypeIdList() {
      let scope = this
      let param = {
        parentId: '-1'
      }
      getMethod('/bu/good/findType', param).then(res => {
        scope.typeIdList = res.data.list
      })
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bu/good/delete', param).then(res => {
          this.loadList()
          this.$message('删除成功')
        })
      })
    },
    batchDeleteRow(rowIndex, data) {
      const selectList = this.$refs.mainTable.selection
      const idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      const param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/bu/good/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    modityGood(row, type, v) {
      let scope = this
      let param = {
        id: row.id
      }
      param[type] = v
      if (v == '2') {
        param['verifyStatus'] = '10'
      }

      if (type == 'verifyStatus' && v == 10) {
        param['isSale'] = 2
      }
      postMethod('/bu/good/updateStatus', param).then(res => {
        scope.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    offLine(row, isSale) {
      console.log(row.isSale, '9898989')
      console.log(isSale, '3333333')
      let scope = this
      let param = {
        id: row.id,
        verifyStatus: '40',//下架退回到待审核
        isSale: isSale
      }
      postMethod('/bu/good/updateStatus', param).then(res => {
        scope.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    addOrEdit(oper, rowIndex, data, hidden) {
      this.isHiddenEditGood = hidden
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/bu/good/findObject', param).then(res => {
          scope.editData = res.data[0]
          scope.editData.verifyStatus = '5' //只要重新提交编辑，状态都变成去仓库
          this.showList = false
          this.showAddOrEdit = true
        })
      } else {
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
      }
    },
    showListPanel(isCancel) {
      this.showList = true
      this.showAddOrEdit = false
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    initLoad() {
      this.loadList()
    },
    async loadList() {
      const { data } = await getMethod('/bu/good/findPage?isGift=' + this.isGift, this.searchParam)

      this.tableData = data
      this.showPagination = this.tableData.total == 0

      for (let i = 0; i < this.tableData.list.length; i++) {
        const { tableList, columnList } = this.loadTableList(this.tableData.list[i].skuPriceList)
        this.tableData.list[i].tableList = tableList
        this.tableData.list[i].columnList = columnList
      }

    },

    // 加载SKU表格的数据
    loadTableList(skuPriceList) {
      let tempTableList = []
      let columnList = []
      for (let i = 0; i < skuPriceList.length; i++) {
        tempTableList[i] = deepCopy(skuPriceList[i])
        tempTableList[i].tdList = []

        const attrName2ValueList = tempTableList[i].skuText.split(';')

        for (let j = 0; j < attrName2ValueList.length; j++) {
          const [specName, specValue] = attrName2ValueList[j].split(':')
          // 填充一次动态列
          if (i === 0) {
            columnList.push(specName)
          }

          // 原理 本列上一行的值一样 合并行
          // 因为线上已经有老结构数据 所以新结构无法存储数据库 更加无法回显 出此下策
          let thisRowSpan = 1
          let thisRowSpanShow = true

          if (i > 0) {
            let tempIndex = i - 1
            let preData = tempTableList[tempIndex].tdList[j]

            // 本行和同列上一行的值相等
            if (preData.value === specValue) {
              // 找到最近的上级节点
              while (tempIndex >= 0) {
                preData = tempTableList[tempIndex].tdList[j]
                if (preData.rowSpanShow) {
                  // 更改他的行数
                  preData.rowSpan++
                  break
                }

                tempIndex--
              }

              thisRowSpan = 1
              thisRowSpanShow = false
            }
          }

          tempTableList[i].tdList.push({
            name: specName,
            value: specValue,
            rowSpan: thisRowSpan,
            rowSpanShow: thisRowSpanShow
          })
        }
      }

      return {
        tableList: tempTableList,
        columnList: columnList
      }
    },

    // 控制合并表格的行和列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.tdList[columnIndex] === undefined) {
        // 超出了 tdList 的长度 不属于动态列的范围 正常显示
        return {
          rowspan: 1,
          colspan: 1
        }
      }

      // 如果不展示 则把此单元格合并到0 即消掉 不显示
      if (!row.tdList[columnIndex].rowSpanShow) {
        return {
          rowspan: 0,
          colspan: 1
        }
      }

      // 否则 按照计算好的行数来合并
      return {
        rowspan: row.tdList[columnIndex].rowSpan,
        colspan: 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  .ly-tool-panel {
    padding: 10px 0px;
  }

  .ly-data-pagination {
    margin-top: 20px;
  }
}

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination > > > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}
</style>
