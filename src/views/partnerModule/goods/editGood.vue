<template>
  <div v-loading="loading" class="update-form-panel">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <el-form ref="dataForm" :model="dataForm" label-width="100px" label-position="left">
          <el-form-item label="商品名称">
            <el-input v-model="dataForm.goodsName" style="width:260px" placeholder="请输入商品名称" :disabled="isDisabled"
              maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="商品卖点">
            <el-input v-model="dataForm.sellingPoint" style="width:260px" placeholder="请输入卖点" maxlength="50"
              :disabled="isDisabled" show-word-limit />
          </el-form-item>
          <el-form-item label="发货方式">
            <el-radio :disabled="isDisabled" v-model="dataForm.deliveryMethod" label="2">邮寄到家</el-radio>
            <el-radio :disabled="isDisabled" v-model="dataForm.deliveryMethod" label="3">到店自提</el-radio>
            <!-- <el-radio :disabled="isDisabled" v-model="dataForm.deliveryMethod" label="1">邮寄/自提</el-radio> -->
          </el-form-item>
          <el-form-item label="属性选择">
            <template v-for="item in dbAttrList">
              <div class="attr-title">{{ item.specName }}:</div>
              <div class="attr-save">
                <el-input style="width:200px;margin-right: 30px" :disabled="isDisabled" placeholder="请输入自定义值"
                  v-model="item.newAttrValue" />
                <el-button type="primary" @click="handlerAttrData(item)" :disabled="isDisabled">添加
                </el-button>
              </div>
              <div class="attr-content">
                <el-checkbox v-for="(valItem,index) in item.skuObj" :key="valItem.index" :disabled="isDisabled"
                  :checked="valItem.isChecked" @change="changeAttrList(valItem)">
                  {{ valItem.skuText }}
                </el-checkbox>
              </div>
            </template>
            <template>
              <div class="attr-title">自定义规格:</div>
              <div class="attr-save">
                <el-button @click="addAttrNameInput" type="primary" :disabled="isDisabled">添加</el-button>
              </div>

              <template v-for="(attrItem,index) in addAttrParam">
                <div class="attr-content">
                  <el-input style="width:200px;margin-right: 30px" :disabled="attrItem.disabled" placeholder="请输入规格名称"
                    v-model="attrItem.specName" @blur="disableSpecNameInput(attrItem,index)" />
                  <el-button type="danger" @click="deleteAttrNameInput(attrItem.specName,index)" icon="el-icon-delete">
                    删除
                  </el-button>
                  <span class="warning-text">{{ attrItem.specValueWarningStr }}</span>
                </div>

                <!--属性值-->
                <div class="attr-content">
                  <el-input v-for="(attrValueItem,i) in attrItem.skuList" :key="i" :disabled="isDisabled"
                    style="width:200px;margin-right: 30px;margin-bottom: 3vh" placeholder="请输入规格值"
                    v-model="attrValueItem.skuText" @blur="addAttrValueInput(attrItem,i)"
                    @input="checkUniqueAndWarning(attrItem,i)">
                    <el-button :disabled="attrItem.skuList.length === 1||isDisabled"
                      @click="deleteAttrValueInput(attrItem.specName,attrItem.skuList,i)" type="text" slot="suffix"
                      icon="el-icon-delete"></el-button>
                  </el-input>
                </div>
              </template>
            </template>
          </el-form-item>
          <el-form-item label="新SKU配置">
            <el-table style="width: 100%; margin-bottom: 20px;" :data="tableList" :span-method="objectSpanMethod"
              border>
              <el-table-column align="center" v-for="(item,index) in columnList" :key="index" :label="item" width="">
                <template slot-scope="scope">
                  {{ scope.row.tdList[index].value }}
                  <!--                  {{ `${index} , ${scope.$index}` }}-->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="stock" label="库存" width="250">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.stock" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column v-if="dataForm.deliveryMethod==2"  align="center" prop="supplyPrice" label="供应价" width="250">
                <template slot-scope="scope">
                  <el-input-number :min="0" v-model="scope.row.supplyPrice" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="marketPrice" label="建议零售价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.marketPrice" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="salePrice" label="会员价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="goodsCode" label="物料编码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.goodsCode" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="goodsImgUrl" label="SKU展示图">
                <template slot-scope="scope">
                  <img :src="scope.row.goodsImgUrl" width="60px" height="60px"
                    onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' ">
                </template>
              </el-table-column>
              <el-table-column align="center" prop="id" label="上传图片">
                <template slot-scope="scope">
                  <el-upload class="avatar-uploader" :headers="token" :disabled="isDisabled" :action="uploadSkuImgUrl"
                    :show-file-list="false" :on-success="handleSuccessSkuImg" :before-upload="beforeUploadSkuImg">
                    <i class="el-icon-plus avatar-uploader-icon" @click="uploadClk(scope)" />
                  </el-upload>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="视频">
            <el-input v-show="false" v-model="dataForm.goodsVideo" :disabled="isDisabled" />
            <el-upload :class="{hide:hideGoodVideoUpload}" :action="uploadVideoUrl" :disabled="isDisabled"
              list-type="picture-card" v-bind:on-progress="uploadVideoProcess" v-bind:on-success="handleVideoSuccess"
              v-bind:before-upload="beforeUploadVideo" v-bind:show-file-list="false">
              <video v-if="dataForm.goodsVideo !='' && !videoFlag" v-bind:src="goodsVideoUrl" class="video-avatar"
                style="height: inherit;min-width: -webkit-fill-available;" controls="controls">
                您的浏览器不支持视频播放
              </video>
              <i v-else-if="dataForm.goodsVideo =='' && !videoFlag" class="el-icon-plus"></i>
              <i v-if="dataForm.goodsVideo !='' && !videoFlag" @click="handleGoodVideoRemove" class="el-icon-error"
                style="position: absolute;top: 0;display: flex;"></i>
              <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent"
                style="margin-top:7px;"></el-progress>
              <div slot="tip" class="el-upload__tip">推荐视频尺寸：1:1或16:9
              </div>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
          </el-form-item>

          <el-form-item label="封面图片">
            <div id="front-img">
              <el-input v-show="false" v-model="dataForm.goodsCoverImg" :disabled="isDisabled" />
              <el-upload :action="uploadGoodsCoverImageUrl" list-type="picture-card" :disabled="isDisabled"
                :on-preview="handleGoodImagePreview" :before-upload="beforeGoodsCoverImageUpload"
                :on-success="handleGoodsCoverImageSuccess" :class="{hide:hideGoodsCoverImageUpload}"
                :file-list="uploadGoodsCoverImageList" :on-remove="handleGoodsCoverImageRemove">
                <i :class="addFrontCls" />
                <div slot="tip" class="el-upload__tip" style="line-height: 20px!important;">
                  普通商品推荐图片尺寸：800*941<br/>限时抢购推荐图片尺寸：1000*528
                </div>
              </el-upload>
              <el-dialog>
                <img width="100%" :src="imageUrl" alt>
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-input v-show="false" v-model="dataForm.goodsImg" :disabled="isDisabled" />
            <el-upload :action="uploadGoodImageUrl" list-type="picture-card" :on-preview="handleGoodImagePreview"
              :disabled="isDisabled" :before-upload="beforeGoodImageUpload" :on-success="handleGoodImageSuccess"
              :class="{hide:hideGoodImageUpload}" :file-list="uploadGoodImageList" :on-remove="handleGoodImageRemove">
              <i class="el-icon-plus" />
              <div slot="tip" class="el-upload__tip">推荐图片尺寸：800*941</div>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="售后说明图片">
            <el-radio-group v-model="dataForm.postSaleId">
              <el-radio class="my-el-radio" :disabled="isDisabled" v-for="(item,index) in goodSaleDescList"
                :key="item.id" :label="item.id">
                <div class="my-container">
                  <div class="img" @mouseover="changeImgMask(index,true)" @mouseout="changeImgMask(index,false)">
                    <div ref="imgMask" class="img-mask">
                      <i class="el-icon-zoom-in my-icon" @click="showBigImg(item.imgUrl)"></i>
                    </div>
                    <el-image :src="item.imgUrl" fit="fill" style="width: 100%;height:100%"></el-image>
                  </div>
                  <div class="title">
                    {{ item.name }}
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品详情">
            <qEditor ref="refEditor" :content="detail.detailContent" module-name="detailContent"
              @changeContent="changeContent" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog center :visible.sync="goodSaleDescImgVisible">
      <img width="100%" :src="goodSaleDescImgUrl" alt>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-footer style="padding:0px 100px">
      <el-button @click="backToList()">返回列表</el-button>
    </el-footer>
  </div>
</template>

<script>
  import {
    deepCopy,
    removeByValue
  } from '@/utils/util'
  import {
    getMethod,
    postMethod,
    getUploadUrl
  } from '@/api/request'
  import {
    isInteger
  } from '@/utils/validate'
  import qEditor from '@/components/RichText/quill-editor'
  import Cookies from 'js-cookie'
  import Vue from 'vue'

  export default {
    components: {
      qEditor,
    },
    props: {
      editData: {
        type: Object,
        required: false
      },
      isEditGood: {
        type: Boolean,
        required: false,
        default: true
      },
      isDisabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {
        token: {
          token: Cookies.get('token')
        },
        isEdit: false,
        goodSaleDescImgVisible: false,
        goodSaleDescImgUrl: '',
        goodSaleDescList: [],
        dialogVisible: false,
        dialogImageUrl: '',
        loading: false,
        addFrontCls: 'el-icon-plus',
        uploadSkuImageList: [],
        uploadGoodImageList: [],
        hideGoodImageUpload: false,
        uploadGoodImageUrl: '',
        uploadGoodsCoverImageList: [],
        hideGoodsCoverImageUpload: false,
        uploadGoodsCoverImageUrl: '',
        uploadSkuImgUrl: '',
        hideGoodVideoUpload: false,
        uploadVideoUrl: "",
        fileSortImage: 0,
        imageUrl: '',
        fileList: [],
        rowIndex: -1,
        detail: {
          detailContent: '',
        },
        sourceDbAttrData: [],
        sourceSkuData: [],
        // goodsVideoGroupId:'',
        goodsVideoUrl: '',
        dataForm: {
          postSaleId: '123',
          goodsVideo: '',
          goodsName: '',
          sellingPoint: '',
          deliveryMethod: '2',
          goodsImg: '',
          goodsCoverImg: '',
          goodsDetailContent: '',
          goodsSpecificationList: [],
          goodsSkuList: [],
        },
        list: [], // {规格名称, 规格值列表}
        checkList: [], // 已选择的规格值 {规格名称, [规格值ID]}
        skuArray: [], //已选择sku Id数组
        skuList: [], // good value sku配置（选完规格值之后生成的）
        skuIdToText: {}, //key 规格值ID（skuId） {//规格值文本  //规格名称}
        skuIdList: [], // 点击checkbox后选择的skuId

        // 数据库返回的属性列表
        dbAttrList: [],
        columnList: [],
        tableList: [],

        // 属性区域
        // 自定义属性的值 累加至此 与dbAttrList 一起组合渲染
        dbAttrListAppend: [],

        // 添加属性的参数
        addAttrParam: [],
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: '',
        //进度条的进度，
        isShowUploadVideo: false,

        // SKU 自动填充的逻辑
        SEPARATOR: '@',
        // oldTableList: {
        //   // '黄@L@华为': {}
        // }
        oldTableMap: {
          // '黄@L@华为': {}
        }

      }
    },
    computed: {
      addAttrParamData() {
        // 用于watch引用类型的数据 返回不同的内存指针 做的深拷贝
        return deepCopy(this.addAttrParam)
      }
    },
    mounted() {
      this.initData()
      this.isEdit = this.isEditGood
      this.loadGoodSaleDescList()
    },
    created() {},
    updated() {
       window.scroll(0, 0);
    },
    methods: {
      // 初始化整个页面数据
      initData() {
        // this.buildGoodImageGroupId()
        // this.buildGoodsCoverImageGroupId()
        // this.buildVideoUrlGroupId()
        this.loadEditData()
      },
      backToList() {
        this.$emit("showListPanel", true);
      },
      buildVideoUrlGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadVideoUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      //上传前回调
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50
        // , 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'
        if (['video/mp4'].indexOf(file.type) == -1) {
          this.$message({
            message: '请上传正确的视频格式',
            type: 'warning'
          })
          return false
        }
        if (!fileSize) {
          this.$message({
            message: '视频大小不能超过50MB',
            type: 'warning'
          })
          return false
        }
        this.isShowUploadVideo = false
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      //上传成功回调
      handleVideoSuccess(res, file) {
        this.isShowUploadVideo = true
        this.videoFlag = false
        this.videoUploadPercent = 0
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.uploadVideoList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadVideoList.length; i++) {
          if (this.uploadVideoList[i].groupId == groupId) {
            imageCnt++
          }
        }
        this.goodsVideoUrl = res.data.url
        // this.goodsVideoGroupId= res.data.groupId
        this.dataForm.goodsVideo = res.data.groupId
      },
      handleGoodVideoRemove(res) {
        this.uploadVideoList = []
        this.dataForm.goodsVideo = ''
        this.goodsVideoUrl = ""
        // this.goodsVideoGroupId=''
      },
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
      uploadClk(row) {
        this.rowIndex = row.$index
        this.buildSkuImgGroupId()
      },
      buildSkuImgGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadSkuImgUrl = getUploadUrl() + '?groupId=' + res.data
        })
      },
      handleSuccessSkuImg(res, file) {
        this.tableList[this.rowIndex].goodsImgUrl = res.data.url
        this.tableList[this.rowIndex].goodsImg = res.data.groupId
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.uploadSkuImageList.push(res.data)

        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadSkuImageList.length; i++) {
          if (this.uploadSkuImageList[i].groupId == groupId) {
            imageCnt++
          }
        }
        this.loading = false
      },
      beforeUploadSkuImg(file, row) {
        // this.buildSkuImgGroupId()
        this.loading = true
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
      loadGoodSaleDescList() {
        postMethod('/goods/post-sale/list', {
          pageNum: 1,
          pageSize: 10
        }).then(res => {
          this.goodSaleDescList = res.data.records
          this.goodSaleDescList.forEach(i => {
            i.id = String(i.id)
          })
          if (this.dataForm.postSaleId == '' && this.goodSaleDescList.length > 0) {
            this.dataForm.postSaleId = this.goodSaleDescList[0].id
          }
        })
      },
      buildGoodImageGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadGoodImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodsImg || res.data)
          this.dataForm.goodsImg = this.dataForm.goodsImg || res.data
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


      buildGoodsCoverImageGroupId() {
        getMethod('/oss/get-group-id', null).then(res => {
          this.uploadGoodsCoverImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodsCoverImg || res.data)
          this.dataForm.goodsCoverImg = this.dataForm.goodsCoverImg || res.data
        })
      },
      handleGoodsCoverImageRemove(res) {
        for (let i = 0; i < this.uploadGoodsCoverImageList.length; i++) {
          if (
            this.uploadGoodsCoverImageList[i].filePath ==
            (res.filePath || res.response.data.filePath)
          ) {
            this.uploadGoodsCoverImageList.splice(i, 1)
            break
          }
        }
        document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display =
          'block'
      },
      handleGoodsCoverImageSuccess(res, file) {
        this.loading = false
        res.data.fileType = file.raw.type
        res.data.sort = this.fileSortImage++
        this.uploadGoodsCoverImageList.push(res.data)
        const groupId = res.data.groupId
        let imageCnt = 0
        for (let i = 0; i < this.uploadGoodsCoverImageList.length; i++) {
          if (this.uploadGoodsCoverImageList[i].groupId == groupId) {
            imageCnt++
          }
        }

        if (this.uploadGoodsCoverImageList.length >= 1) {
          this.$nextTick(function() {
            document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style
              .display = 'none'
          })
        }
      },
      beforeGoodsCoverImageUpload(file) {
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
      initDefaultImage(data) {
        this.uploadGoodImageList = data.goodsImg
        this.uploadGoodsCoverImageList = data.goodsCoverImg ? data.goodsCoverImg : [],
        this.goodsVideoUrl = data.goodsVideo ? data.goodsVideo[0].url : ''
        this.uploadVideoList = data.goodsVideo ? data.goodsVideo : []
        if (this.uploadGoodsCoverImageList.length >= 1) {
          document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display =
            'none'
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
      },
      async saveObject() {
        if (this.validate()) {
          let errorMsg = ''
          let feeMsg = ''
          for (let i = 0; i < this.tableList.length; i++) {
            const rowObj = this.tableList[i]
            feeMsg = this.isMoney(rowObj.marketPrice, '零售价', '')
            feeMsg = this.isMoney(rowObj.salePrice, '会员价', feeMsg)

            if (feeMsg != '') {
              this.$message.warning(feeMsg)
              return
            }

            if (rowObj.stock < 0 || rowObj.stock == undefined) {
              errorMsg = '库存不能为空'
            }

            if (rowObj.marketPrice == '') {
              errorMsg = '零售价不能为空'
            }

            if (rowObj.salePrice == '') {
              errorMsg = '会员价不能为空'
            }

            if (rowObj.salePrice - rowObj.marketPrice > 0) {
              errorMsg = '会员价不能大于等于零售价'
            }
          }
          if (this.uploadGoodImageList.length == 0) {
            errorMsg = '请上传商品图片'
          }

          if (this.uploadGoodsCoverImageList.length == 0) {
            errorMsg = '请上传商品封面图'
          }

          if (this.detail.detailContent == '') {
            errorMsg = '请上传商品详情'
          }

          if (this.tableList.length == 0) {
            errorMsg = '请选择SKU'
          }

          if (errorMsg != '') {
            this.$message.warning(errorMsg)
            return
          }


          if (errorMsg.trim() != '') {
            this.$message.warning(errorMsg)
            return
          }

          if (feeMsg != '') {
            this.$message.warning(feeMsg)
            return
          }


          let fileList = []
          fileList = fileList.concat(this.uploadVideoList)
          fileList = fileList.concat(this.uploadGoodImageList)
          fileList = fileList.concat(this.uploadGoodsCoverImageList)
          this.uploadSkuImageList.forEach(i => {
            this.tableList.forEach(j => {
              if (i.groupId == j.goodsImg) {
                fileList.push(i)
              }
            })
          })
          this.fileList.forEach(i => {
            delete i.id
            delete i.status
            delete i.uid
          })
          this.dataForm.fileList = fileList
          this.dataForm.goodsDetailContent = this.detail.detailContent
          this.tableList.forEach(i => {
            delete i.tdList
            delete i.skuCompareId
            delete i.skuCompareText
            delete i.goodsImgUrl
            delete i.supplyPrice
          })
          this.dataForm.goodsSkuList = this.tableList
          // 把ID转换成Text
          // [{"name":"颜色","list":["1298268253058621441","1298268253058621441"]},{"name":"尺寸","list":["1298268035080642561"]}]

          const textList = []
          for (let i = 0; i < this.dbAttrList.length; i++) {
            let pushData = {
              specificationName: '',
              specificationValueParamList: []
            }

            let dbSkuList = this.dbAttrList[i].skuObj
            for (let j = 0; j < dbSkuList.length; j++) {
              if (dbSkuList[j].isChecked) {
                let obj = {
                  specificationValue: dbSkuList[j].skuText
                }
                pushData.specificationValueParamList.push(obj)
              }
            }

            pushData.specificationName = this.dbAttrList[i].specName
            textList.push(pushData)
          }
          this.dataForm.goodsSpecificationList = textList
          const param = this.dataForm
          param.goodsCoverImg = String(param.goodsCoverImg)
          param.goodsImg = String(param.goodsImg)
          param.goodsId = this.editData.goodsId
          delete param.skuList
          if (JSON.stringify(this.sourceDbAttrData) === JSON.stringify(this.dataForm.goodsSpecificationList)) {
            this.sourceSkuData.forEach(j => {
              if (j.goodsImgUrl) {
                delete j.goodsImgUrl
              }
            })
            if (JSON.stringify(this.sourceSkuData) === JSON.stringify(this.dataForm.goodsSkuList)) {
              param.skuModifyStatus = "3"
            } else {
              param.skuModifyStatus = "2"
            }
          } else{
            let sourceDbAttrArr=[]
            let goodsSpecificationArr=[]
            this.sourceDbAttrData.forEach(i => {
              sourceDbAttrArr.push(i.specificationName)
            })
            this.dataForm.goodsSpecificationList.forEach(i => {
              goodsSpecificationArr.push(i.specificationName)
            })
            if (JSON.stringify(sourceDbAttrArr) === JSON.stringify(goodsSpecificationArr)) {
              param.skuModifyStatus = "4"
            } else {
              param.skuModifyStatus = "1"
            }
          }
          try {

            await this.handleSaveAttrData()

            const {
              data
            } = await postMethod('/goods/update', param)
            this.$message.success('操作成功')
            this.$emit('showListPanel', true)
          } catch (ex) {
            console.log(ex)
          }

        }
      },
      validate() {
        const dataFrm = this.dataForm
        if (dataFrm['goodsName'] == '') {
          this.$message({
            message: '商品名称不能为空',
            type: 'warning'
          })
          return false
        }

        if (dataFrm['sellingPoint'] == '') {
          this.$message({
            message: '卖点不能为空',
            type: 'warning'
          })
          return false
        }
        return true
      },
      submitUpdate() {
        this.saveObject()
      },

      // 装配编辑数据
      async loadEditData() {
        if (this.editData.goodsId) {
          this.addAttrParam = []
          this.uploadGoodsCoverImageList = []
          this.uploadGoodImageList = []
          this.dataForm = {
            postSaleId: String(this.editData.postSaleId),
            goodsVideo: this.editData.goodsVideo ? this.editData.goodsVideo[0].groupId : '',
            goodsName: this.editData.goodsName,
            sellingPoint: this.editData.sellingPoint,
            deliveryMethod: String(this.editData.deliveryMethod),
            goodsImg: this.editData.goodsImg ? this.editData.goodsImg[0].groupId : '',
            goodsCoverImg: this.editData.goodsCoverImg ? this.editData.goodsCoverImg[0].groupId : '',
            // goodsDetailContent:  this.editData.goodsDetailContent,
          }
          // this.dbAttrList
          let arr = []
          arr = this.editData.specificationList.map(item => {
            return {
              specName: item.specificationName,
              skuObj: item.specificationValueList.map(i => {
                return {
                  skuText: i.specificationValue,
                  isChecked: true
                }
              })
            }
          })
          this.sourceSkuData = this.editData.skuList
          let sourceDbAttrData = []
          sourceDbAttrData = this.editData.specificationList.map(item => {
            return {
              specificationName: item.specificationName,
              specificationValueParamList: item.specificationValueList
            }
          })
          this.sourceDbAttrData = sourceDbAttrData
          this.dbAttrList = arr
          this.dataForm.skuList = this.editData.skuList
          this.initDefaultImage(this.editData)
          // this.$refs['refEditor'].setContent(this.editData.goodsDetailContent)
          this.$refs.refEditor.richText = this.editData.goodsDetailContent
          // this.loadTableList()
        }
        // this.loadSkuAttr(true)
        this.loadTableList()
      },

      // 加载SKU表格的数据
      loadTableList() {
        this.columnList = []

        let tempTableList = []
        for (let i = 0; i < this.dataForm.skuList.length; i++) {
          tempTableList[i] = deepCopy(this.dataForm.skuList[i])
          tempTableList[i].tdList = []

          const attrName2ValueList = tempTableList[i].skuText.split(';')

          for (let j = 0; j < attrName2ValueList.length; j++) {
            const [specName, specValue] = attrName2ValueList[j].split(':')
            // 填充一次动态列
            if (i === 0) {
              this.columnList.push(specName)
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

        this.tableList = tempTableList
      },

      // 加载 Sku 的属性列表
      async loadSkuAttr(autoChecked) {
        this.tableList = []
        this.columnList = []
        this.addAttrParam = []
        // let data=[{specName:'颜色',skuObj:[{skuText:"红色"},{skuText:"黑色"}]},
        //           {specName:'尺寸',skuObj:[{skuText:"100*20"},{skuText:"200*30"}]}]
        // this.dbAttrList = data
        autoChecked && this.loadAttrChecked()

      },

      // 回显已选中的属性
      loadAttrChecked() {
        const allPriceList = []
        let allPriceText = ''
        this.dataForm.skuList.forEach(priceObj => {
          allPriceList.push(priceObj.skuText)
        })

        allPriceText = allPriceList.join(';')

        for (let i = 0; i < this.dbAttrList.length; i++) {
          let dbSkuList = this.dbAttrList[i].skuObj
          for (let j = 0; j < dbSkuList.length; j++) {
            if (allPriceText.indexOf(dbSkuList[j].typeName + ':' + dbSkuList[j].skuText) != -1) {
              dbSkuList[j].isChecked = true
            }
          }
        }
      },

      // 修改选中属性，生成拼装输入框数据
      changeAttrList(valItem) {
        // valItem.isChecked = valItem.isChecked == true ? true : false
        valItem.isChecked = !valItem.isChecked
        this.generatorSkuList()
      },

      // 生成SKU列表
      generatorSkuList() {
        this.fillTableList()
        this.columnList = []
        this.tableList = []

        for (let i = this.dbAttrList.length - 1; i >= 0; i--) {
          this.tableList = this.addColumn(this.tableList, this.dbAttrList[i].specName, this.dbAttrList[i].skuObj)
        }
      },

      // 填充老数据
      fillTableList() {
        this.oldTableMap = new Map()
        for (const skuInfo of this.tableList) {
          let fillData = {}
          let key = this.getKeyByTdList(skuInfo.tdList)
          this.oldTableMap.set(key, skuInfo)
        }
      },

      // 通过动态列表 获取对应Key值
      getKeyByTdList(list) {
        return list.map(item => {
          return item.value
        }).join(this.SEPARATOR)
      },

      // 添加列
      addColumn(dataList, specName, specValue) {

        // 此属性规格是否有选中值 有的话 添加到动态列中
        let isAddColume = false

        let newDataList = []
        for (let i = 0; i < specValue.length; i++) {
          // 当前规格未选中
          if (!specValue[i].isChecked) {
            continue
          }

          isAddColume = true

          // 初始化数组
          if (dataList.length === 0) {
            newDataList.push({
              tdList: [{
                name: specName,
                value: specValue[i].skuText,
                rowSpan: 1,
                rowSpanShow: true
              }],
              skuText: `${specName}:${specValue[i].skuText}`,
              skuCompareText: specValue[i].skuText,
              skuCompareId: '',
              stock: '',
              marketPrice: '',
              salePrice: '',
              goodsCode: '',
              supplyPrice: '',
              goodsImgUrl: ''
            })
            continue
          }

          // 进行乘积
          for (let j = 0; j < dataList.length; j++) {
            newDataList.push({
              tdList: [{
                name: specName,
                value: specValue[i].skuText,
                rowSpan: dataList.length,
                rowSpanShow: j === 0 ? true : false
              }, ...dataList[j].tdList],
              // 注意拼接顺序同上 之前的后拼
              skuText: `${specName}:${specValue[i].skuText};${dataList[j].skuText}`,
              skuCompareText: `${specValue[i].skuText}:${dataList[j].skuCompareText}`,
              skuCompareId: dataList[j].skuCompareId,
              // stock: dataList[j].stock,
              // marketPrice: dataList[j].marketPrice,
              // salePrice: dataList[j].salePrice,
              // goodsCode: dataList[j].goodsCode,
              // supplyPrice: dataList[j].supplyPrice,
              // goodsImgUrl: dataList[j].goodsImgUrl
              stock: '',
              marketPrice: '',
              salePrice: '',
              goodsCode: '',
              supplyPrice: '',
              goodsImgUrl: ''
            })
          }
        }

        // 当前属性有规格被选中 添加动态列
        if (isAddColume) {
          this.columnList = [specName, ...this.columnList]
        }

        // 判断之前的老值 进行填充
        // for (const newData of newDataList) {
        //   let key = this.getKeyByTdList(newData.tdList)
        //   if (this.oldTableMap.get(key)) {
        //     let oldData = this.oldTableMap.get(key)
        //     // stock: '',
        //     // marketPrice: '',
        //     // salePrice: '',
        //     // goodsCode: '',
        //     // supplyPrice: '',
        //     // goodsImgUrl: ''
        //     // 用老的数据替换新的这几个值
        //     let { stock, marketPrice, salePrice, goodsCode, supplyPrice, goodsImgUrl } = oldData
        //     newData = { ...newData, stock, marketPrice, salePrice, goodsCode, supplyPrice, goodsImgUrl }
        //     console.log(JSON.stringify(newData))
        //   }
        // }

        for (let i = 0; i < newDataList.length; i++) {
          let key = this.getKeyByTdList(newDataList[i].tdList)
          if (this.oldTableMap.get(key)) {
            let oldData = this.oldTableMap.get(key)
            // stock: '',
            // marketPrice: '',
            // salePrice: '',
            // goodsCode: '',
            // supplyPrice: '',
            // goodsImgUrl: ''
            // 用老的数据替换新的这几个值
            let {
              stock,
              marketPrice,
              salePrice,
              goodsCode,
              supplyPrice,
              goodsImgUrl
            } = oldData
            newDataList[i] = {
              ...newDataList[i],
              stock,
              marketPrice,
              salePrice,
              goodsCode,
              supplyPrice,
              goodsImgUrl
            }
          }
        }

        // 拼装过了 返回拼装的新结构
        // 没拼装过 返回老数据结构
        return newDataList.length > 0 ? newDataList : dataList
      },

      // 控制合并表格的行和列
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (this.tableList[rowIndex].tdList[columnIndex] === undefined) {
          // 超出了 tdList 的长度 不属于动态列的范围 正常显示
          return {
            rowspan: 1,
            colspan: 1
          }
        }

        // 如果不展示 则把此单元格合并到0 即消掉 不显示
        if (!this.tableList[rowIndex].tdList[columnIndex].rowSpanShow) {
          return {
            rowspan: 0,
            colspan: 1
          }
        }

        // 否则 按照计算好的行数来合并
        return {
          rowspan: this.tableList[rowIndex].tdList[columnIndex].rowSpan,
          colspan: 1
        }
      },

      async handlerAttrData(item) {
        if (item.newAttrValue === undefined || item.newAttrValue === '') {
          this.$message.warning('请输入后重试')
          return
        }

        let handleParam = {
          // typeDataStr: item.id,
          specName: item.specName,
          skuList: []
        }

        for (let i = 0; i < item.skuObj.length; i++) {
          handleParam.skuList.push({
            sort: i,
            skuText: item.skuObj[i].skuText,
            type: 'spec',
            isChecked:item.skuObj[i].isChecked?item.skuObj[i].isChecked:false
          })
        }

        handleParam.skuList = [
          ...handleParam.skuList,
          {
            sort: item.skuObj.length,
            skuText: item.newAttrValue,
            type: 'spec'
          }
        ]

        if (!this.checkSpecValueUnique(handleParam.skuList)) return

        await this.saveAttrData(handleParam)

        this.$message.success('操作成功')
        // this.initData()
      },

      // 保存属性数据
      async saveAttrData(handleParam) {
        this.dbAttrList.forEach(i => {
          if (i.specName == handleParam.specName) {
            i.skuObj = handleParam.skuList
          }
        })

        // let param = {
        //   jsonParam: JSON.stringify(handleParam)
        // }
        // const {
        //   data
        // } = await postMethod('/bu/goodSpec/update', param)
      },

      // 添加属性名
      addAttrNameInput() {
        this.addAttrParam.push({
          // 各个属性 id为空表示新增
          // id: '',
          specName: '',
          specSort: this.addAttrParam.length,
          specValueWarningStr: '',
          disabled: false,
          skuList: [{
            sort: 0,
            skuText: '',
            type: 'spec'
          }]
        })
      },

      // 删除属性名
      deleteAttrNameInput(specName, index) {

        // 删除DBList中的属性渲染
        for (let i = 0; i < this.dbAttrList.length; i++) {
          if (this.dbAttrList[i].specName !== specName) continue
          // 不属于后追加的数据 不处理
          if (this.dbAttrList[i].id !== undefined) continue
          this.dbAttrList.splice(i, 1)
          i--
        }

        // 删除属性名展示栏位
        this.addAttrParam.splice(index, 1)

        // 重新生成sku表格
        this.generatorSkuList()
      },

      // 添加属性值
      addAttrValueInput(attrItem, index) {
        let attrSkuList = attrItem.skuList
        let specName = attrItem.specName

        this.removeNullAttrValueInput(attrSkuList)
        this.removeUniqueAttrValueInput(attrItem, index)

        this.pushDbAttrList(specName)
        this.generatorSkuList()

        attrSkuList.push({
          sort: attrSkuList.length,
          skuText: '',
          type: 'spec'
        })
      },

      // 判断规格值是否有重复
      checkSpecValueUnique(attrSkuList) {
        var skuTextArray = attrSkuList.map(item => item.skuText)
        var isDuplicate = skuTextArray.some((item, idx) =>
          skuTextArray.indexOf(item) != idx
        )
        if (isDuplicate) {
          this.$message.warning('规格值不能重复')
          return false
        }
        return true
      },

      // 判断规格名是否有重复
      checkSpecNameUnique(attrList) {
        var attrTextArray = attrList.map(item => item.specName)
        var isDuplicate = attrTextArray.some((item, idx) =>
          attrTextArray.indexOf(item) != idx
        )
        if (isDuplicate) {
          this.$message.warning('规格名称不能重复')
          return false
        }
        return true
      },

      // 自动移除空属性值的输入框
      removeNullAttrValueInput(attrSkuList) {
        for (var i = 0; i < attrSkuList.length; i++) {
          if (attrSkuList[i].skuText === '') {
            this.deleteAttrValueInput(attrSkuList[i].specName, attrSkuList, i)
            i--
          }
        }
      },

      // 当前值与之前的值有重复 移除当前值不添加
      removeUniqueAttrValueInput(attrItem, index) {
        let attrSkuList = attrItem.skuList
        if (attrSkuList[index] === undefined) return
        let checkText = attrSkuList[index].skuText
        let deleteIndex = -1
        for (var i = 0; i < attrSkuList.length; i++) {
          if (index != i && attrSkuList[i].skuText === checkText) {
            deleteIndex = i
            break
          }
        }

        // 删除输入框的值
        deleteIndex >= 0 && attrSkuList.splice(deleteIndex, 1)
        attrItem.specValueWarningStr = ''
      },

      // 校验重复值并给予提示
      checkUniqueAndWarning(attrItem, index) {
        let attrSkuList = attrItem.skuList
        if (attrSkuList[index] === undefined) return
        let checkText = attrSkuList[index].skuText

        let isShow = false
        for (var i = 0; i < attrSkuList.length; i++) {
          if (index != i && attrSkuList[i].skuText === checkText) {
            isShow = true
            break
          }
        }

        attrItem.specValueWarningStr = ''

        if (checkText === '') return
        isShow && (attrItem.specValueWarningStr = `属性值 ${checkText} 重复`)

      },

      // 删除属性值
      deleteAttrValueInput(specName, attrSkuList, index) {
        // 删除Sku表格的值
        this.removeAttrList(specName, attrSkuList[index].skuText)

        // 删除输入框的值
        attrSkuList.splice(index, 1)

        this.generatorSkuList()
      },

      // 保存属性值
      async handleSaveAttrData() {
        // 校验参数
        for (let i = 0; i < this.addAttrParam.length; i++) {
          if (this.addAttrParam[i].skuList.length <= 1) continue

          let checkParam = deepCopy(this.addAttrParam[i])
          checkParam.skuList.pop()

          if (!this.checkSpecValueUnique(checkParam.skuList)) {
            throw new Error('操作失败')
          }
        }

        for (let i = 0; i < this.addAttrParam.length; i++) {
          if (this.addAttrParam[i].skuList.length <= 1) continue

          let handleParam = deepCopy(this.addAttrParam[i])
          handleParam.skuList.pop()
          await this.saveAttrData(handleParam)
        }
      },

      disableSpecNameInput(attrItem, index) {

        let specName = attrItem.specName

        if (specName === '') return

        for (let i = 0; i < this.addAttrParam.length; i++) {
          if (i !== index && this.addAttrParam[i].specName === specName) {
            this.addAttrParam.splice(index, 1)
            this.$message.warning('无法添加已存在的规格名')
            return
          }
        }

        attrItem.disabled = true

      },

      // 推送新产生的数据到属性备选池
      pushDbAttrList(specName) {
        for (let i = 0; i < this.addAttrParam.length; i++) {

          // 空值跳过
          if (this.addAttrParam[i].specName === '') continue
          // 不属于自己的不操作
          if (this.addAttrParam[i].specName !== specName) continue

          // 属于自己的操作 需要还原场地
          for (let j = 0; j < this.dbAttrList.length; j++) {
            if (this.dbAttrList[j].specName !== this.addAttrParam[i].specName) continue
            // 不属于后追加的数据 不恢复现场
            if (this.dbAttrList[j].id !== undefined) {
              this.$message.warning('无法添加已存在的规格名')
              this.addAttrParam.splice(i, 1)

              return
            }

            this.dbAttrList[j].skuObj = []
          }

          let attrSkuList = this.addAttrParam[i].skuList
          for (let j = 0; j < attrSkuList.length; j++) {
            if (attrSkuList[j].skuText === '') continue

            this.addDbAttrAppendList(specName, attrSkuList[j].skuText)
          }
        }
      },

      // 添加选中数据
      addDbAttrAppendList(specName, specValue) {
        for (let i = 0; i < this.dbAttrList.length; i++) {
          if (this.dbAttrList[i].specName === specName) {
            let isExists = false
            this.dbAttrList[i].skuObj.forEach(item => {
              if (item.skuText === specValue) {
                isExists = true
              }
            })

            if (isExists) return

            this.dbAttrList[i].skuObj.push({
              isChecked: true,
              skuText: specValue,
              typeName: specName
            })
            return
          }
        }

        this.dbAttrList.push({
          specName: specName,
          skuObj: [{
            isChecked: true,
            skuText: specValue,
            typeName: specName
          }]
        })
      },

      // 移除选中数据
      removeAttrList(specName, specValue) {
        for (let i = 0; i < this.dbAttrList.length; i++) {
          if (this.dbAttrList[i].specName !== specName) continue

          removeByValue(this.dbAttrList[i].skuObj, 'skuText', specValue)

          if (this.dbAttrList[i].skuObj.length !== 0) continue

          this.dbAttrList.splice(i, 1)
        }
      },

      // 校验添加的规格名是否合格
      checkUniqueSpecName(specName) {
        let countNum = 0
        for (let i = 0; i < this.dbAttrList.length; i++) {
          if (this.dbAttrList[i].specName !== specName) continue
          countNum++
        }

        if (countNum > 1) {
          // 校验不通过
          return false
        }
        // 无重复 校验通过
        return true
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

  $attrTitleWidth: 5vw;
  $attrContentWidth: 60vw;

  .attr-title {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    font-weight: 500;
    //text-align: center;


    width: $attrTitleWidth;
    //background: #2ac06d;
  }

  .attr-save {
    display: inline-block;
    overflow: hidden;
    width: $attrContentWidth;
  }

  .attr-content {
    display: flex;
    flex-wrap: wrap;
    width: $attrContentWidth;
    margin-left: calc(#{$attrTitleWidth} + 4px);
    margin-bottom: 3vh;

    .warning-text {
      font-size: 16px;
      color: red;
      margin-left: 1vw;
    }
  }


  // input 字数限制样式调整
  .card-panel-col>>>.el-input__count {
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
  .hide .el-upload--picture-card,
  .hide {
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
