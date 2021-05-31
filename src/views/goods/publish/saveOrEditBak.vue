<template>
  <div v-loading="loading" class="update-form-panel">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">

        <el-form ref="dataForm" :model="dataForm" label-width="100px" label-position="left">
          <el-form-item label="商品名称">
            <el-input
              v-model="dataForm.goodName" style="width:260px"
              placeholder="请输入商品名称"
              :disabled="isHiddenEditGood"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="所属分类">
            <el-select v-model="dataForm.typeId" placeholder="请选择分类" @change="loadtypeId2List()"
                       :disabled="isHiddenEditGood"
            >
              <el-option
                v-for="item in typeIdList"
                :key="item.id"
                :value-key="item.typeName"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="dataForm.typeId2" placeholder="请选择" @change="loadSkuCompose()"
                       :disabled="isHiddenEditGood"
            >
              <el-option
                v-for="item in typeId2List"
                :key="item.id"
                :value-key="item.typeName"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="属性选择">

            <div v-for="(v, i) in list" :key="i" class="mt-20">
              <b>{{ v.name }}：</b>
              <el-checkbox-group v-model="checkList[i].list" @change="handleClick" :disabled="isHiddenEditGood">
                <el-checkbox v-for="k in v.list" :key="k.skuId" :label="k.skuId">{{ k.skuText }}</el-checkbox>
              </el-checkbox-group>
            </div>

          </el-form-item>
          <el-form-item label="SKU配置">
            <el-table ref="skuTable" :data="skuList" style="width: 100%; margin-bottom: 20px;">

              <el-table-column prop="skuText" label="SKU" width="220px"/>
              <el-table-column prop="stock" label="库存" width="150px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stock" :disabled="dataForm.stockType==1 || isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column prop="salePrice" label="建议零售价" width="150px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column prop="saleMemPrice" label="建议会员价" width="150px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.saleMemPrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column prop="skuImg" label="SKU展示图" width="150px">
                <template slot-scope="scope">
                  <img :src="scope.row.skuImg" width="60px" height="60px"
                       onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' "
                  >
                </template>
              </el-table-column>
              <el-table-column prop="id" label="上传图片" width="150px">
                <template slot-scope="scope">
                  <el-upload
                    :disabled="isHiddenEditGood"
                    class="avatar-uploader"
                    :action="uploadSkuImgUrl"
                    :show-file-list="false"
                    :on-success="handleSuccessSkuImg"
                    :before-upload="beforeUploadSkuImg"
                  >
                    <i class="el-icon-plus avatar-uploader-icon" @click="uploadClk(scope)"/>
                  </el-upload>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="库存类型" v-show="false">
            <!-- <el-radio v-model="dataForm.stockType" label="1" @change="stockChange">全局</el-radio> -->
            <el-radio v-model="dataForm.stockType" label="2" @change="stockChange" :disabled="isHiddenEditGood">局部
            </el-radio>
          </el-form-item>
          <el-form-item v-if="dataForm.stockType==1" label="库存数量">
            <el-input v-model="dataForm.stockNum" style="width:260px" @keyup.native="syncGlobalStock"
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="商品产地">
            <el-input v-model="dataForm.goodOrigin" style="width:260px" placeholder="输入商品产地"
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="dataForm.goodCode" style="width:260px" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="所属品牌">
            <el-select v-model="dataForm.goodBrand" :disabled="isHiddenEditGood">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :value-key="item.brandName"
                :label="item.brandName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="封面图片">
            <div id="front-img">
              <el-input v-show="false" v-model="dataForm.goodFrontImage" :disabled="isHiddenEditGood"/>
              <el-upload
                :action="uploadGoodFrontImageUrl"
                list-type="picture-card"
                :on-preview="handleGoodImagePreview"
                :before-upload="beforeGoodFrontImageUpload"
                :on-success="handleGoodFrontImageSuccess"
                :class="{hide:hideGoodFrontImageUpload}"
                :file-list="uploadGoodFrontImageList"
                :on-remove="handleGoodFrontImageRemove"
                :disabled="isHiddenEditGood"
              >
                <i :class="addFrontCls"/>
              </el-upload>
              <el-dialog>
                <img width="100%" :src="imageUrl" alt>
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-input v-show="false" v-model="dataForm.goodImage" :disabled="isHiddenEditGood"/>
            <el-upload
              :action="uploadGoodImageUrl"
              list-type="picture-card"
              :on-preview="handleGoodImagePreview"
              :before-upload="beforeGoodImageUpload"
              :on-success="handleGoodImageSuccess"
              :class="{hide:hideGoodImageUpload}"
              :file-list="uploadGoodImageList"
              :on-remove="handleGoodImageRemove"
              :disabled="isHiddenEditGood"
            >
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-dialog center :visible.sync="goodSaleDescImgVisible">
            <img width="100%" :src="goodSaleDescImgUrl" alt>
          </el-dialog>
          <el-form-item label="售后说明图片">
            <el-radio-group v-model="dataForm.afterSaleId" :disabled="isHiddenEditGood">
              <el-radio
                class="my-el-radio"
                v-for="(item,index) in goodSaleDescList"
                :key="item.id"
                :label="item.id"
              >
                <div class="my-container">
                  <div class="img"
                       @mouseover="changeImgMask(index,true)"
                       @mouseout="changeImgMask(index,false)"
                  >
                    <div ref="imgMask" class="img-mask">
                      <i class="el-icon-zoom-in my-icon" @click="showBigImg(item.imgUrl)"></i>
                    </div>
                    <el-image
                      :src="item.imgUrl"
                      fit="fill"
                      style="width: 100%;height:100%"
                    ></el-image>
                  </div>
                  <div class="title">
                    {{ item.name }}
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品卖点">
            <el-input v-model="dataForm.goodMerit"
                      style="width:260px"
                      placeholder="请输入卖点"
                      maxlength="20"
                      show-word-limit
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="价格核算">
            <el-row>
              <el-col :span="2">
                成本价:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.primeCost" placeholder="成本价" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                包装成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.packageCost" placeholder="包装成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                加工成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.processCost" placeholder="加工成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">
                物流成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.expressCost" placeholder="物流成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                利润:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.profit" placeholder="利润" style="width:80px" :disabled="isHiddenEditGood"/>
              </el-col>
              <el-col :span="2">
                预估报价:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.predictFee" placeholder="预估报价" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-show="false" label="是否礼品">
            <el-input v-model="isGift" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-switch v-model="dataForm.recommend" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="是否定制">
            <el-switch v-model="dataForm.custom" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="商品风格专场">
            <el-checkbox-group v-model="goodStyleList" @change="changeStyle" :disabled="isHiddenEditGood">
              <el-checkbox v-for="styleText in styleList" :key="styleText" :label="styleText">{{
                  styleText
                }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="商家承偌服务">
            <el-checkbox-group v-model="serviceRuleList" :disabled="isHiddenEditGood">
              <el-checkbox v-for="obj in buServiceList" :key="obj" :label="obj">{{ obj }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="商品详情">
            <qEditor
              ref="refEditor"
              :content="detail.detailContent"
              module-name="detailContent"
              @changeContent="changeContent"
            />
          </el-form-item>
          <el-form-item v-show="false" label="售后保障">
            <qEditor1
              ref="refEditor1"
              :content-q1="detail.postSale"
              module-name="postSale"
              @changePostSaleContent="changePostSaleContent"
              :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item v-show="false" label="商品清单">
            <qEditor2
              ref="refEditor2"
              :q2content="detail.listDetail"
              module-name="listDetail"
              @changeListDetailContent="changeListDetailContent"
              :disabled="isHiddenEditGood"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitUpdate" :disabled="isHiddenEditGood">提交</el-button>
            <el-button @click="cancelUpdate">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from '@/api/request'
import { isInteger } from '@/utils/validate'
import qEditor from '@/components/RichText/quill-editor'
import qEditor1 from '@/components/RichText/quill-editor_1'
import qEditor2 from '@/components/RichText/quill-editor_2'

export default {
  components: { qEditor, qEditor1, qEditor2 },
  props: {
    editData: {
      type: Object,
      required: false
    },
    isGift: {
      type: String,
      required: true,
      default: '1'
    },
    isHiddenEditGood: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      goodSaleDescImgVisible: false,
      goodSaleDescImgUrl: '',
      goodSaleDescList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      addFrontCls: 'el-icon-plus',
      stockCls: '',
      showSku: false,
      styleList: ['新品上架', '七星睡眠'],
      goodStyleList: [],
      buServiceList: ['正品保证', '全场包邮', '无理由退货', '超时赔偿'],
      serviceRuleList: [],
      typeIdList: [],
      typeId2List: [],
      brandList: [],
      uploadGoodImageList: [],
      hideGoodImageUpload: false,
      uploadGoodImageUrl: '',
      uploadGoodFrontImageList: [],
      hideGoodFrontImageUpload: false,
      uploadGoodFrontImageUrl: '',
      uploadSkuImgUrl: getUploadUrl() + '?groupId=-1',
      fileSortImage: 0,
      imageUrl: '',
      fileList: [],
      rowIndex: -1,
      detail: {
        detailContent: '',
        postSale: '',
        listDetail: ''
      },
      dataForm: {
        afterSaleId: '',
        goodName: '',
        goodOrigin: '',
        goodMerit: '',
        stockNum: 0,
        primeCost: '',
        packageCost: '',
        processCost: '',
        expressCost: '',
        predictFee: '',
        profit: '',
        goodCode: '',
        typeId2: '',
        typeId: '',
        goodBrand: '',
        recommend: true,
        custom: true,
        skuPriceList: [],
        goodStyle: '',
        serviceRule: '',
        stockType: '2',
        goodImage: '',
        goodFrontImage: '',
        skuJsonStr: '',
        checkRuleStr: '',
        detailStr: '',
        isGift: '',
        id: ''
      },
      list: [], // {规格名称, 规格值列表}
      checkList: [], // 已选择的规格值 {规格名称, [规格值ID]}
      skuArray: [], //已选择sku Id数组
      skuList: [], // good value sku配置（选完规格值之后生成的）
      skuIdToText: {}, //key 规格值ID（skuId） {//规格值文本  //规格名称}
      skuIdList: [] // 点击checkbox后选择的skuId
    }
  },
  computed: {},
  mounted() {
    this.loadtypeIdList()
    this.loadGoodSaleDescList()
    this.initLoad()
    this.loadGoodBrandList()
    this.buildGoodImageGroupId()
    this.buildGoodFrontImageGroupId()
    this.$nextTick(function() {
      if (this.editData.id) {
        this.goodStyleList = this.editData.goodStyle.split(',')
        this.serviceRuleList = this.editData.serviceRule.split(',')
        this.dataForm = this.editData
        this.detail = this.editData.detail
        this.initLoad()
        this.initDefaultImage()
        this.loadtypeId2List(this.dataForm.typeId2)
        this.$refs['refEditor'].setContent(this.detail.detailContent)
        this.$refs['refEditor1'].setContent(this.detail.postSale)
        this.$refs['refEditor2'].setContent(this.detail.listDetail)
      }
    })
  },
  created() {
  },
  methods: {
    changeImgMask(index, flag) {
      this.$refs.imgMask[index].style = flag ? 'display:block' : 'display:none'
    },
    showBigImg(url) {
      this.goodSaleDescImgUrl = url
      this.goodSaleDescImgVisible = true
    },
    syncGlobalStock() {
      if (isNaN(this.dataForm.stockNum)) {
        this.$message({
          message: '库存数量输入有误',
          type: 'warning'
        })
        return
      }

      if (this.dataForm.stockNum < 0) {
        this.$message({
          message: '库存不能输入负数',
          type: 'warning'
        })
        return
      }

      if (this.skuList.length == 0) {
        this.$message({
          message: '请选勾选规格',
          type: 'warning'
        })
        return
      }

      for (let i = 0; i < this.skuList.length; i++) {
        const skuObj = this.skuList[i]
        skuObj.stock = this.dataForm.stockNum
      }
    },
    changeStyle(value) {

    },
    stockChange() {
      if (this.dataForm.stockType == '1') {
        for (let i = 0; i < this.skuList.length; i++) {
          const skuObj = this.skuList[i]
          skuObj.stock = this.dataForm.stockNum
        }
      }
    },
    uploadClk(row) {
      this.rowIndex = row.$index
    },
    handleSuccessSkuImg(res, file) {
      this.skuList[this.rowIndex].skuImg = res.data.url
      this.loading = false
    },
    beforeUploadSkuImg(file, row) {
      this.loading = true
    },
    initLoad() {
      const scope = this
    },
    changeListDetailContent(val) {
      this.detail.listDetail = val
    },
    changePostSaleContent(val) {
      this.detail.postSale = val
    },
    changeContent(val) {
      this.detail.detailContent = val
    },
    loadSkuCompose() {
      const scope = this
      this.list = []
      this.checkList = []

      const param = {
        id: this.dataForm.typeId2
      }
      getMethod('/bu/good/findTypeBySpec', param).then(res => {
        const list = res.data

        const allPriceList = []
        let allPriceText = ''
        this.dataForm.skuPriceList.forEach(priceObj => {
          allPriceList.push(priceObj.skuText)
        })

        allPriceText = allPriceList.join(';')

        scope.skuIdToText = {}
        list.forEach(o => {
          const existsList = o['skuObj'] //规格对应的所有规格值列表

          for (let i = 0; i < o['skuObj'].length; i++) {
            const skuObject = o['skuObj'][i]
            scope.skuIdToText[skuObject.skuId] = {
              skuText: skuObject.skuText, //规格值
              typeName: skuObject.typeName //规格名称
            }
          }

          this.list.push({
            name: o['specName'],
            list: o['skuObj']
          })

          this.checkList.push({
            name: o['specName'],
            list: []
          })

          if (this.editData.id) {
            this.$nextTick(function() {
              this.checkList.forEach(checkObj => {
                existsList.forEach(o => {
                  if (checkObj.name == o.typeName && allPriceText.indexOf(checkObj.name + ':' + o.skuText) != -1) {
                    checkObj.list.push(o.skuId)
                  }
                })
              })
              this.skuList = this.dataForm.skuPriceList
            })
          }
        })
      })
    },
    handleClick(value) {
      // 先清空数据，保证连续点击按钮，数据不会重复
      this.skuArray = []
      this.skuList = []
      this.skuIdList = []

      // this.checkList=[]
      // 将选中的规格组合成一个大数组 [[1, 2], [a, b]...]
      this.checkList.forEach(element => {
        element.list.length > 0 ? this.skuArray.push(element.list) : ''
      })
      // 勾选了规格，才调用方法

      if (this.skuArray.length > 0) {
        this.getSkuData([], 0, this.skuArray)
      } else {
        this.$message.error('请先勾选规格')
      }
    },
    // 递归获取每条SKU数据
    getSkuData(skuArr = [], i, list) {
      for (let j = 0; j < list[i].length; j++) {
        if (i < list.length - 1) {
          skuArr[i] = list[i][j]
          skuArr[i] = this.getSkuKey(skuArr[i])
          this.getSkuData(skuArr, i + 1, list) // 递归循环
        } else {
          skuArr[i] = this.getSkuKey(list[i][j])

          const titleText = [...skuArr].join(';')

          let stockSingle = 0
          // 如果是全局库存
          if (this.dataForm.stockType == 1) {
            stockSingle = this.dataForm.stockNum
          }
          const column = {
            skuText: titleText,
            skuCompareText: this.getSkuText(titleText),
            skuCompareId: this.skuIdList.join(','),
            stock: stockSingle,
            salePrice: '',
            saleMemPrice: '',
            supplyPrice: '',
            skuImg: ''
          }
          this.skuList.push(column) // 扩展运算符，连接两个数组
        }
      }
    },
    getSkuText(titleText) {
      const newArr = []
      const titleArr = titleText.split(';')
      titleArr.forEach(titleObj => {
        newArr.push(titleObj.split(':')[1])
      })
      return newArr.join(':')
    },
    getSkuKey(skuId) {
      this.skuIdList.push(skuId)
      const skuObj = this.skuIdToText[skuId]
      return skuObj['typeName'] + ':' + skuObj['skuText']
    },
    loadtypeIdList() {
      const scope = this
      const param = {
        parentId: '-1'
      }
      getMethod('/bu/good/findType', param).then(res => {
        scope.typeIdList = res.data
      })
    },

    async loadGoodSaleDescList() {
      const res = await getMethod('/bu/good/findAllSaleList')

      this.goodSaleDescList = res.data

      if (this.dataForm.afterSaleId == '' && this.goodSaleDescList.length > 0) {
        this.dataForm.afterSaleId = this.goodSaleDescList[0].id
      }
    },
    loadtypeId2List(typeId2) {
      const scope = this
      this.dataForm.typeId2 = typeId2 || ''
      const param = {
        parentId: this.dataForm.typeId
      }
      getMethod('/bu/good/findType', param).then(res => {
        scope.typeId2List = res.data

        if (scope.editData.id) {
          scope.$nextTick(function() {
            scope.loadSkuCompose()
          })
        }
      })
    },
    loadGoodBrandList() {
      const scope = this

      getMethod('/bu/good/findBrand', null).then(res => {
        scope.brandList = res.data
      })
    },
    buildGoodImageGroupId() {
      getMethod('/bu/oss/groupId', null).then(res => {
        this.uploadGoodImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodImage || res.data)
        this.dataForm.goodImage = this.dataForm.goodImage || res.data
      })
    },
    handleGoodImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleGoodImageRemove(res) {
      for (let i = 0; i < this.uploadGoodImageList.length; i++) {
        if (
          this.uploadGoodImageList[i].filePath ==
          (res.filePath || res.response.data.filePath)
        ) {
          this.uploadGoodImageList.splice(i, 1)
          break
        }
      }
      this.hideGoodImageUpload = false
    },
    handleGoodImageSuccess(res, file) {
      res.data.fileType = file.raw.type
      res.data.sort = this.fileSortImage++
      this.uploadGoodImageList.push(res.data)
      const groupId = res.data.groupId
      let imageCnt = 0
      for (let i = 0; i < this.uploadGoodImageList.length; i++) {
        if (this.uploadGoodImageList[i].groupId == groupId) {
          imageCnt++
        }
      }

      // if (imageCnt >= 5) {
      // 	this.hideGoodImageUpload = true;
      // }
      this.loading = false
    },
    beforeGoodImageUpload(file) {
      // this.loading = true
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return fileTypeVerify && isLt2M
    },
    buildGoodFrontImageGroupId() {
      getMethod('/bu/oss/groupId', null).then(res => {
        this.uploadGoodFrontImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodFrontImage || res.data)
        this.dataForm.goodFrontImage = this.dataForm.goodFrontImage || res.data
      })
    },
    handleGoodFrontImagePreview() {
    },
    handleGoodFrontImageRemove(res) {
      for (let i = 0; i < this.uploadGoodFrontImageList.length; i++) {
        if (
          this.uploadGoodFrontImageList[i].filePath ==
          (res.filePath || res.response.data.filePath)
        ) {
          this.uploadGoodFrontImageList.splice(i, 1)
          break
        }
      }
      document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'block'
    },
    handleGoodFrontImageSuccess(res, file) {
      this.loading = false
      res.data.fileType = file.raw.type
      res.data.sort = this.fileSortImage++
      this.uploadGoodFrontImageList.push(res.data)
      const groupId = res.data.groupId
      let imageCnt = 0
      for (let i = 0; i < this.uploadGoodFrontImageList.length; i++) {
        if (this.uploadGoodFrontImageList[i].groupId == groupId) {
          imageCnt++
        }
      }

      if (this.uploadGoodFrontImageList.length >= 1) {
        this.$nextTick(function() {
          document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
        })
      }
    },
    beforeGoodFrontImageUpload(file) {
      // this.loading = true
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return fileTypeVerify && isLt2M
    },
    initDefaultImage() {
      this.fileList = this.dataForm.files
      for (let i = 0; i < this.dataForm.files.length; i++) {
        const imageObj = this.dataForm.files[i]
        if (imageObj.groupId == this.dataForm.goodImage) {
          this.uploadGoodImageList.push(imageObj)
        }
        if (imageObj.groupId == this.dataForm.goodFrontImage) {
          this.uploadGoodFrontImageList.push(imageObj)
        }
      }
      this.uploadGoodImageList = this.uploadGoodImageList.reverse()
      if (this.uploadGoodFrontImageList.length >= 1) {
        document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
      }
    },
    isMoney(amount, type, errorMsg) { // 22,111,22.11   判断是否是金额
      if (errorMsg != '') {
        return errorMsg
      }
      if (amount == '0.0' ||
        amount == '0.00' ||
        amount == '0.') {
        return type + '的金额格式有误'
      }

      if (amount != null && amount != '' && amount != '0') {
        var exp = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/
        if (!exp.test(amount)) {
          return type + '的金额格式有误'
        }
      } else {
        return type + '金额不能为空或0'
      }
      return ''

      // if(arg == undefined){
      // 	return false
      // }
      // if(arg.split(".").length >= 2){
      // 	return false
      // }

      // if(arg.split(".").length == 1){
      // 	if(arg.split(".").length > 2){
      // 		return false;
      // 	}
      // }
      // arg = arg.toString();
      // let argChar = "0123456789.";
      // var beginArg = arg.substring(0,1);
      // if(beginArg == "." || beginArg==","){
      // 	return false;
      // }

      // for(let i = 0;i<arg.length;i++){
      // 	if(argChar.indexOf(arg.substring(i,i+1)) == -1)  return false;
      // }
      // return true;
    },
    saveObject() {
      const scope = this
      let errorMsg = ''

      if (this.uploadGoodImageList.length == 0) {
        errorMsg = '请上传商品图片'
      }

      if (this.uploadGoodFrontImageList.length == 0) {
        errorMsg = '请上传商品封面图'
      }

      if (this.detail.detailContent == '') {
        errorMsg = '请上传商品详情'
      }

      if (this.skuList.length == 0) {
        errorMsg = '请选择SKU'
      }

      if (errorMsg != '') {
        this.$message({
          message: errorMsg,
          type: 'warning'
        })
        return
      }

      let feeMsg = ''
      for (let i = 0; i < this.skuList.length; i++) {
        const rowObj = this.skuList[i]
        feeMsg = this.isMoney(rowObj.salePrice, '零售价', '')
        feeMsg = this.isMoney(rowObj.saleMemPrice, '会员价', feeMsg)

        if (feeMsg != '') {
          this.$message({
            message: feeMsg,
            type: 'warning'
          })
          return
        }

        if (rowObj.stock < 0) {
          errorMsg = '库存不能为空'
        }

        if (rowObj.salePrice == '') {
          errorMsg = '零售价不能为空'
        }

        if (rowObj.saleMemPrice == '') {
          errorMsg = '会员价不能为空'
        }

        if (rowObj.saleMemPrice - rowObj.salePrice > 0) {
          errorMsg = '会员价不能大于等于零售价'
        }
      }

      if (errorMsg.trim() != '') {
        this.$message({
          message: errorMsg,
          type: 'warning'
        })
        return
      }

      // primeCost:成本价
      // packageCost:包装成本
      // processCost:加工成本
      // expressCost:物流成本
      // profit:利润
      // predictFee:预估报价
      // let priceFrm = this.dataForm
      // if(this.dataForm.primeCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'成本价',feeMsg)
      // }

      // if(this.dataForm.packageCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.packageCost,'包装价',feeMsg)
      // }

      // if(this.dataForm.processCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.processCost,'加工成本',feeMsg)
      // }

      // if(this.dataForm.expressCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'加工成本',feeMsg)
      // }

      // if(this.dataForm.profit != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'利润',feeMsg)
      // }

      // if(this.dataForm.predictFee != ''){
      // 	feeMsg =  this.isMoney(priceFrm.predictFee,'预估价',feeMsg)
      // }

      if (feeMsg != '') {
        this.$message({
          message: feeMsg,
          type: 'warning'
        })
        return
      }

      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy

        let fileList = []
        fileList = fileList.concat(this.uploadGoodImageList)
        fileList = fileList.concat(this.uploadGoodFrontImageList)

        this.dataForm.fileJsonStr = JSON.stringify(fileList)
        this.dataForm.files = []
        this.dataForm.detailStr = JSON.stringify(this.detail)
        this.dataForm.skuJsonStr = JSON.stringify(this.skuList)
        this.dataForm.goodStyle = this.goodStyleList.join(',')
        this.dataForm.serviceRule = this.serviceRuleList.join(',')
        // 把ID转换成Text
        // [{"name":"颜色","list":["1298268253058621441","1298268253058621441"]},{"name":"尺寸","list":["1298268035080642561"]}]
        const textList = []
        for (let i = 0; i < this.checkList.length; i++) {
          const valueList = this.checkList[i].list
          const valueText = []
          for (let k = 0; k < valueList.length; k++) {
            valueText.push(this.skuIdToText[valueList[k]].skuText)
          }

          textList.push({
            'name': this.checkList[i]['name'],
            'list': valueText
          })
        }
        this.dataForm.checkRuleStr = JSON.stringify(textList)
        this.dataForm.isGift = this.isGift
        const param = JSON.stringify(this.dataForm)
        postMethod('/bu/good/update', param).then(res => {
          scope.typeList = res.data
          this.detail = {}
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('showListPanel', true)
        })
      }
    },
    validate() {
      const dataFrm = this.dataForm
      if (dataFrm['goodName'] == '') {
        this.$message({
          message: '商品名称不能为空',
          type: 'warning'
        })
        return false
      }

      if (dataFrm['goodCode'] == '') {
        this.$message({
          message: '商品货号不能为空',
          type: 'warning'
        })
        return false
      }

      if (dataFrm['goodMerit'] == '') {
        this.$message({
          message: '卖点不能为空',
          type: 'warning'
        })
        return false
      }

      // const needInt = [
      // 	"primeCost",
      // 	"packageCost",
      // 	"processCost",
      // 	"expressCost",
      // 	"profit"
      // ];
      // for (let i = 0; i < needInt.length; i++) {
      // 	if (!isInteger(this.dataForm[needInt[i]])) {
      // 		this.$message({
      // 			message: "请输入正整数",
      // 			type: "warning"
      // 		});
      // 		return false;
      // 	}
      // }

      return true
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      this.saveObject()
    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  // font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}


// input 字数限制样式调整
.card-panel-col > > > .el-input__count {
  height: 100%;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #D0D0D0;
  font-size: 12px;

  position: absolute;
  transform: translate(-100%, 50%);
}
</style>
<style lang="scss">
.hide .el-upload--picture-card, .hide {
  display: none;
}

.el-radio__input {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: top;
}

.my-el-radio {
  width: 240px;
  height: 200px;

  .my-container {
    display: inline-block;
    width: 190px;
    height: 180px;

    .img {
      position: relative;
      width: 190px;
      height: 140px;
      border-radius: 10px;
      overflow: hidden;

      .img-mask {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1;
        color: white;

        .my-icon {
          position: absolute;
          display: inline-block;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 30px;
        }
      }
    }

    .title {
      width: 190px;
      height: 40px;
      line-height: 40px;
      text-align: center
    }

  }
}

</style>
