<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              <el-button  type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
              <el-button v-if="false" plain type="primary" @click="remove('add')" icon="el-icon-document-add">删除
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >

            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="addrName" label="地址名称" width="150px">
              <template slot-scope="scope">
                {{ scope.row.addrName }}
                <el-tag
                  v-if="scope.row.isDefault == 1"
                  effect="light"
                  size="mini"
                >
                  默认
                </el-tag>
              </template>
            </el-table-column>
            <!--            <el-table-column prop="enable" label="地址类型" width="80px">-->
            <!--              <template slot-scope="scope">-->
            <!--                {{ scope.row.type == '1' ? '发货地址' : '退货地址' }}-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column prop="addrSeq" label="地址序号" width="100px"></el-table-column>
            <el-table-column prop="person" label="联系人" width="100px"></el-table-column>
            <el-table-column prop="mobilePhone" label="移动手机号" width="120px"></el-table-column>
            <el-table-column prop="telPhone" label="座机号" width="120px"></el-table-column>
            <el-table-column label="所在城市" width="200px">
              <template slot-scope="scope">
                {{ `${scope.row.provincetext} ${scope.row.citytext} ${scope.row.areaText}` }}
              </template>
            </el-table-column>

            <el-table-column prop="addrDtl" label="详细地址" width="220px"></el-table-column>
            <el-table-column prop="sendCom" label="发货公司" width="100px"></el-table-column>
            <el-table-column prop="enable" label="状态" width="80px">
              <template slot-scope="scope">
                {{ scope.row.enable == '0' ? '禁用' : '启用' }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="city" label="城市" width="150px"></el-table-column>
            <el-table-column prop="province" label="省份" width="150px"></el-table-column> -->

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="addOrEdit('edit',scope.$index, tableData)"
                    size="mini" type="primary"
                  >编辑
                  </el-button>
                  <el-button
                    v-if="false"
                    @click="remove(scope.row.addrId)"
                    size="mini" type="primary"
                  >删除
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
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod } from '@/api/request-new'

export default {
  computed: {},
  mounted() {
    this.initLoad()
    this.loadcityList()
    this.loadprovinceList()
  },
  components: { saveOrEdit },
  created() {
  },
  data() {
    return {
      cityList: [],
      provinceList: [],
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        delFlag: '1',
        typeName: '',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  methods: {
    loadcityList() {
      let scope = this
      // getMethod("/backend/areas/findCity", null).then(res => {
      // 	scope.cityList = res.data.list;
      // });
    },
    remove(ids) {
      let param = {}
      if (ids != undefined) {
        param.addrIds = ids
      } else {
        let selectList = this.$refs.mainTable.selection
        if (selectList.length == 0) {
          this.$message({
            message: '请选择一条要删除的记录',
            type: 'success'
          })
        }
        let idArr = []
        for (let i = 0; i < selectList.length; i++) {
          idArr.push(selectList[i].id)
        }
        let param = {
          addrIds: idArr.join(',')
        }
      }
      postMethod('/address/delete', param).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        scope.editData = res.data[0]
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    loadprovinceList() {
      let scope = this
      // getMethod("/backend/areas/findProvince", null).then(res => {
      // 	scope.provinceList = res.data.list;
      // });
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      let scope = this

      if (oper == 'edit') {
        let param = {
          addrId: data.list[rowIndex].addrId
        }
        getMethod('/address/findObject', param).then(res => {
          scope.editData = res.data[0]
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
    loadList() {
      let scope = this
      getMethod('/address/findPage', this.searchParam).then(
        res => {
          scope.tableData = res.data
          scope.showPagination = scope.tableData.total == 0
        }
      )
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
</style>
