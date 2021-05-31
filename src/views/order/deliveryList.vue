<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              <el-button type="danger" @click="remove()" icon="el-icon-delete">
                删除
              </el-button>

              <el-button type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">
                新建
              </el-button>
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
            @selection-change="handleSelectionChange"
          >

            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="快递公司">
              <template slot-scope="scope">
                {{ scope.row.expressName }}
                <el-tag
                  v-if="scope.row.isDefault == 1"
                  effect="light"
                  size="mini"
                >
                  默认
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="业务类型">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.deliveryTypeList"
                  :key="item.id"
                  effect="light"
                  class="my-tag"
                >
                  {{ item.expressTypeName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="付款方式">
              <template slot-scope="scope">
                {{ scope.row.paymentMethod == 1 ? '到付' : '' }}
                {{ scope.row.paymentMethod == 2 ? '现付' : '' }}
                {{ scope.row.paymentMethod == 3 ? '月结' : '' }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{ scope.row.status == '0' ? '启用' : '禁用' }}
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="addOrEdit('edit',scope.$index, tableData)"
                    size="mini" type="primary"
                  >编辑
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 0"
                    @click="disable(scope.row.id)"
                    size="mini" type="primary"
                  >禁用
                  </el-button>
                  <el-button
                    v-else-if="scope.row.status == 1"
                    @click="enable(scope.row.id)"
                    size="mini" type="primary"
                  >启用
                  </el-button>
                </el-button-group>
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
            :page-size="this.searchParam.pageSize"
            :current-page="this.searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
    </div>
    <deliverySaveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"/>
  </div>
</template>

<script>
import deliverySaveOrEdit from './deliverySaveOrEdit'
import { getMethod, putMethod, deleteMethod } from '@/api/request-new'

export default {
  computed: {},
  mounted() {
    this.initLoad()
  },
  components: { deliverySaveOrEdit },
  created() {
  },
  data() {
    return {
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      // 全选框选中集合
      multipleSelection: []
    }
  },
  methods: {
    initLoad() {
      this.loadList()
    },
    async loadList() {
      const { data } = await getMethod('/delivery/companyList', this.searchParam)
      this.tableData = data
      this.showPagination = this.tableData.total == 0
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async enable(id) {
      const res = await putMethod('/delivery/enable', { id })
      if (res.code !== 200) {
        this.$message.error('操作失败')
        return
      }
      this.$message.success('操作成功')
      this.loadList()
    },
    async disable(id) {
      const res = await putMethod('/delivery/disable', { id })
      if (res.code !== 200) {
        this.$message.error('操作失败')
        return
      }
      this.$message.success('操作成功')
      this.loadList()
    },
    async remove() {
      const removeIds = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        removeIds.push(this.multipleSelection[i].id)
      }

      if (removeIds.length == 0) {
        this.$message.warning('要删除的元素不能为空')
        return
      }

      try {
        await this.$confirm('是否继续删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await deleteMethod('/delivery/company', { ids: removeIds })
        if (res.code !== 200) {
          this.$message.error('删除失败')
          return
        }

        this.loadList()
        this.$message.success('删除成功')
      } catch (e) {
      }
    },
    search() {
      this.loadList()
    },
    async addOrEdit(oper, rowIndex, data) {
      if (oper == 'edit') {
        const res = await getMethod(`/delivery/companyInfo/${data.list[rowIndex].id}`)
        res.data.kdnArgs = JSON.parse(res.data.kdnArgs)
        this.editData = res.data
        this.showList = false
        this.showAddOrEdit = true
      } else {
        this.editData = {}
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
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  .ly-tool-panel {
    padding: 10px 0px;
  }
}

.my-tag {
  margin-right: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
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
