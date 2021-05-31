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
          <el-form-item label="商品类型">
            <el-select v-model="dataForm.isMarketing" :disabled="dataForm.id != ''">
              <el-option label="普通商品" value="0"/>
              <el-option label="活动商品" value="1"/>
            </el-select>
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
            <el-select v-model="dataForm.typeId2" placeholder="请选择" @change="loadSkuAttr()"
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
            <template v-for="item in dbAttrList">
              <div class="attr-title">{{ item.specName }}:</div>
              <div class="attr-save">
                <el-input
                  style="width:200px;margin-right: 30px"
                  :disabled="isHiddenEditGood || item.id === undefined"
                  placeholder="请输入自定义值"
                  v-model="item.newAttrValue"
                />
                <el-button
                  v-if="item.id !== undefined"
                  type="primary"
                  @click="handlerAttrData(item)"
                  :disabled="isHiddenEditGood"
                >添加
                </el-button>
              </div>
              <div class="attr-content">
                <el-checkbox
                  v-for="(valItem,index) in item.skuObj"
                  :key="valItem.skuId"
                  :label="valItem.skuId"
                  :checked="valItem.isChecked"
                  @change="changeAttrList(valItem)"
                  :disabled="isHiddenEditGood"
                >
                  {{ valItem.skuText }}
                </el-checkbox>
              </div>
            </template>
            <template>
              <div class="attr-title">自定义规格:</div>
              <div class="attr-save">
                <el-button @click="addAttrNameInput" type="primary" :disabled="isHiddenEditGood">添加</el-button>
              </div>

              <template v-for="(attrItem,index) in addAttrParam">
                <div class="attr-content">
                  <el-input
                    style="width:200px;margin-right: 30px"
                    :disabled="attrItem.disabled"
                    placeholder="请输入规格名称"
                    v-model="attrItem.specName"
                    @blur="disableSpecNameInput(attrItem,index)"
                  />
                  <el-button
                    type="danger"
                    @click="deleteAttrNameInput(attrItem.specName,index)"
                    :disabled="isHiddenEditGood"
                    icon="el-icon-delete"
                  >删除
                  </el-button>
                  <span class="warning-text">{{ attrItem.specValueWarningStr }}</span>
                </div>

                <!--属性值-->
                <div class="attr-content">
                  <el-input
                    v-for="(attrValueItem,i) in attrItem.skuList" :key="i"
                    style="width:200px;margin-right: 30px;margin-bottom: 3vh"
                    :disabled="isHiddenEditGood"
                    placeholder="请输入规格值"
                    v-model="attrValueItem.skuText"
                    @blur="addAttrValueInput(attrItem,i)"
                    @input="checkUniqueAndWarning(attrItem,i)"
                  >
                    <el-button
                      :disabled="isHiddenEditGood || attrItem.skuList.length === 1"
                      @click="deleteAttrValueInput(attrItem.specName,attrItem.skuList,i)"
                      type="text" slot="suffix"
                      icon="el-icon-delete"
                    ></el-button>
                  </el-input>
                </div>
              </template>
            </template>
          </el-form-item>
          <el-form-item label="新SKU配置">
            <el-table
              style="width: 100%; margin-bottom: 20px;"
              :data="tableList"
              :span-method="objectSpanMethod"
              border
            >
              <el-table-column
                align="center"
                v-for="(item,index) in columnList"
                :key="index"
                :label="item"
                width=""
              >
                <template slot-scope="scope">
                  {{ scope.row.tdList[index].value }}
                  <!--                  {{ `${index} , ${scope.$index}` }}-->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="stock" label="库存" width="250">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.stock" :disabled="dataForm.stockType==1 || isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="salePrice" label="建议零售价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="saleMemPrice" label="建议会员价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.saleMemPrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="goodsCode" label="物料编码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.goodsCode" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="skuImg" label="SKU展示图">
                <template slot-scope="scope">
                  <img :src="scope.row.skuImg" width="60px" height="60px"
                       onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' "
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" prop="id" label="上传图片">
                <template slot-scope="scope">
                  <el-upload
                    :disabled="isHiddenEditGood"
                    class="avatar-uploader"
                    :headers="token"
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

          <el-form-item label="视频">
            <el-input v-show="false" v-model="dataForm.goodsVideo" :disabled="isHiddenEditGood"/>
            <el-upload :class="{hide:hideGoodVideoUpload}" :action="uploadVideoUrl" list-type="picture-card"
                       v-bind:on-progress="uploadVideoProcess"
                       v-bind:on-success="handleVideoSuccess" v-bind:before-upload="beforeUploadVideo"
                       v-bind:show-file-list="false"
                       :disabled="isHiddenEditGood"
            >
              <video v-if="dataForm.goodsVideo !='' && !videoFlag" v-bind:src="dataForm.goodsVideo" class="video-avatar"
                     style="height: inherit;min-width: -webkit-fill-available;"
                     controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <i v-else-if="dataForm.goodsVideo =='' && !videoFlag" class="el-icon-plus"></i>
              <i v-if="dataForm.goodsVideo !='' && !videoFlag" @click="handleGoodVideoRemove" class="el-icon-error"
                 style="position: absolute;top: 0;display: flex;"
              ></i>
              <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent"
                           style="margin-top:7px;"
              ></el-progress>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
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
                <div slot="tip" class="el-upload__tip">推荐图片尺寸:
                  {{ dataForm.isMarketing == 0 ? '800 * 800' : '1200 * 636' }}
                </div>
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
              <div slot="tip" class="el-upload__tip">推荐图片尺寸: 800 * 800</div>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
          </el-form-item>
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
                      maxlength="50"
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
                <el-input v-model="dataForm.primeCost" placeholder="成本价" style="width:180px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                包装成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.packageCost" placeholder="包装成本" style="width:180px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                加工成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.processCost" placeholder="加工成本" style="width:180px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
            <el-row style="margin-top: 1vh">
              <el-col :span="2">
                物流成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.expressCost" placeholder="物流成本" style="width:180px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                利润:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.profit" placeholder="利润" style="width:180px" :disabled="isHiddenEditGood"/>
              </el-col>
              <el-col :span="2">
                预估报价:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.predictFee" placeholder="预估报价" style="width:180px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-show="false" label="是否礼品">
            <el-input v-model="isGift" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item v-if="dataForm.isMarketing == 0" label="是否推荐">
            <el-switch v-model="dataForm.recommend" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item v-if="dataForm.isMarketing == 0" label="是否定制">
            <el-switch v-model="dataForm.custom" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <!-- <el-form-item label="商品风格专场">
             <el-checkbox-group v-model="goodStyleList" :disabled="isHiddenEditGood">
               <el-checkbox v-for="styleText in styleList" :key="styleText" :label="styleText">{{
                   styleText
                 }}
               </el-checkbox>
             </el-checkbox-group>
           </el-form-item> -->
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

    <el-dialog center :visible.sync="goodSaleDescImgVisible">
      <img width="100%" :src="goodSaleDescImgUrl" alt>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy, removeByValue } from '@/utils/util'
import { getMethod, postMethod, getUploadUrl } from '@/api/request'
import { isInteger } from '@/utils/validate'
import qEditor from '@/components/RichText/quill-editor'
import qEditor1 from '@/components/RichText/quill-editor_1'
import qEditor2 from '@/components/RichText/quill-editor_2'
import Cookies from 'js-cookie'
import Vue from 'vue'

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
      token: {
        token: Cookies.get('token')
      },
      goodSaleDescImgVisible: false,
      goodSaleDescImgUrl: '',
      goodSaleDescList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      addFrontCls: 'el-icon-plus',
      // styleList: ['新品上架', '七星睡眠'],
      // goodStyleList: [],
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
      hideGoodVideoUpload: false,
      uploadVideoUrl: getUploadUrl(),
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
        goodsVideo: '',
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
        // goodStyle: '',
        serviceRule: '',
        stockType: '2',
        goodImage: '',
        goodFrontImage: '',
        skuJsonStr: '',
        checkRuleStr: '',
        detailStr: '',
        isMarketing: '0',
        isGift: '',
        id: ''
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
      addAttrParam: [
        // {
        //   // 各个属性 id为空表示新增
        //   // id: '',
        //   typeDataStr: '',
        //   specName: '',
        //   skuList: [
        //     { skuText: '' }
        //   ]
        // }
      ],
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
  },
  created() {
  },
  // watch: {
  //   // 监听添加参数
  //   addAttrParamData: {
  //     handler: function(newValue, oldValue) {
  //       let flushSkuList = false
  //       this.dbAttrList.forEach(item => {
  //         for (let i = 0; i < oldValue.length; i++) {
  //           // 空指针判断
  //           if (oldValue[i] === undefined || newValue[i] === undefined) continue
  //
  //           // 非此规格名 不处理
  //           if (item.specName !== oldValue[i].specName) continue
  //
  //           // 非后追加数据 不处理
  //
  //           if (item.id !== undefined) continue
  //           // 新老值相同 不处理
  //           if (newValue[i].specName === oldValue[i].specName) continue
  //
  //           item.specName = newValue[i].specName
  //           flushSkuList = true
  //         }
  //       })
  //
  //       flushSkuList && this.generatorSkuList()
  //
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    // 初始化整个页面数据
    initData() {
      this.loadGoodBrandList()
      this.buildGoodImageGroupId()
      this.buildGoodFrontImageGroupId()
      this.loadtypeIdList()
      this.loadGoodSaleDescList()

      this.loadEditData()

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
      console.log(res, 'res')
      //后台上传地址
      if (res.code == 200) {
        this.dataForm.goodsVideo = res.data.url
      } else {
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    handleGoodVideoRemove(res) {
      console.log('res删除', res)
      this.dataForm.goodsVideo = ''
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
      this.tableList[this.rowIndex].skuImg = res.data.url
      this.loading = false
    },
    beforeUploadSkuImg(file, row) {
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
    async saveObject() {
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

      if (this.tableList.length == 0) {
        errorMsg = '请选择SKU'
      }

      if (errorMsg != '') {
        this.$message.warning(errorMsg)
        return
      }

      let feeMsg = ''
      for (let i = 0; i < this.tableList.length; i++) {
        const rowObj = this.tableList[i]
        feeMsg = this.isMoney(rowObj.salePrice, '零售价', '')
        feeMsg = this.isMoney(rowObj.saleMemPrice, '会员价', feeMsg)

        if (feeMsg != '') {
          this.$message.warning(feeMsg)
          return
        }

        if (rowObj.stock < 0 || rowObj.stock == undefined) {
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
        this.$message.warning(errorMsg)
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
        this.$message.warning(feeMsg)
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
        this.dataForm.skuJsonStr = JSON.stringify(this.tableList)
        // this.dataForm.goodStyle = this.goodStyleList.join(',')
        this.dataForm.serviceRule = this.serviceRuleList.join(',')
        // 把ID转换成Text
        // [{"name":"颜色","list":["1298268253058621441","1298268253058621441"]},{"name":"尺寸","list":["1298268035080642561"]}]

        const textList = []
        for (let i = 0; i < this.dbAttrList.length; i++) {
          let pushData = {
            name: '',
            list: []
          }

          let dbSkuList = this.dbAttrList[i].skuObj
          for (let j = 0; j < dbSkuList.length; j++) {
            if (dbSkuList[j].isChecked) {
              pushData.list.push(dbSkuList[j].skuText)
            }
          }

          pushData.name = this.dbAttrList[i].specName
          textList.push(pushData)
        }

        this.dataForm.checkRuleStr = JSON.stringify(textList)

        this.dataForm.isGift = this.isGift
        if (this.dataForm.isMarketing == 1) {
          this.dataForm.custom = null
        }
        console.log(this.dataForm, '传的值')
        const param = JSON.stringify(this.dataForm)

        try {

          await this.handleSaveAttrData()

          const { data } = await postMethod('/bu/good/update', param)
          this.typeList = data
          this.detail = {}
          this.$message.success('操作成功')
          this.$emit('showListPanel', true)
        } catch (ex) {
          console.log(ex)
        }

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
    },

    // 装配编辑数据
    async loadEditData() {
      if (this.editData.id) {
        this.addAttrParam = []
        this.uploadGoodFrontImageList = []
        this.uploadGoodImageList = []

        // this.goodStyleList = this.editData.goodStyle.split(',')
        this.serviceRuleList = this.editData.serviceRule.split(',')
        this.dataForm = this.editData
        this.dataForm.isMarketing = this.dataForm.isMarketing + ''
        this.detail = this.editData.detail
        this.initDefaultImage()
        this.$refs['refEditor'].setContent(this.detail.detailContent)
        this.$refs['refEditor1'].setContent(this.detail.postSale)
        this.$refs['refEditor2'].setContent(this.detail.listDetail)
        // await this.loadtypeId2List(this.dataForm.typeId2)
        //
        // this.loadTableList()
      }

      await this.loadtypeId2List(this.dataForm.typeId2)

      this.loadTableList()
    },

    // 加载SKU表格的数据
    loadTableList() {
      this.columnList = []

      let tempTableList = []
      for (let i = 0; i < this.dataForm.skuPriceList.length; i++) {
        tempTableList[i] = deepCopy(this.dataForm.skuPriceList[i])
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

    // 按分类加载Sku属性
    async loadtypeId2List(typeId2) {
      this.tableList = []
      this.columnList = []
      this.addAttrParam = []
      this.dataForm.typeId2 = typeId2 || ''
      const { data } = await getMethod('/bu/good/findType', { parentId: this.dataForm.typeId })
      this.typeId2List = data

      if (this.editData.id) {
        this.loadSkuAttr(true)
      } else {
        this.loadSkuAttr(false)
      }
    },

    // 加载 Sku 的属性列表
    async loadSkuAttr(autoChecked) {
      this.tableList = []
      this.columnList = []
      this.addAttrParam = []

      const { data } = await getMethod('/bu/good/findTypeBySpec', { id: this.dataForm.typeId2 })

      this.dbAttrList = data
      autoChecked && this.loadAttrChecked()

    },

    // 回显已选中的属性
    loadAttrChecked() {
      const allPriceList = []
      let allPriceText = ''
      this.dataForm.skuPriceList.forEach(priceObj => {
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
      valItem.isChecked = valItem.isChecked == true ? true : false
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
            tdList: [{ name: specName, value: specValue[i].skuText, rowSpan: 1, rowSpanShow: true }],
            skuText: `${specName}:${specValue[i].skuText}`,
            skuCompareText: specValue[i].skuText,
            skuCompareId: '',
            stock: '',
            salePrice: '',
            saleMemPrice: '',
            goodsCode: '',
            supplyPrice: '',
            skuImg: ''
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
            // salePrice: dataList[j].salePrice,
            // saleMemPrice: dataList[j].saleMemPrice,
            // goodsCode: dataList[j].goodsCode,
            // supplyPrice: dataList[j].supplyPrice,
            // skuImg: dataList[j].skuImg
            stock: '',
            salePrice: '',
            saleMemPrice: '',
            goodsCode: '',
            supplyPrice: '',
            skuImg: ''
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
      //     // salePrice: '',
      //     // saleMemPrice: '',
      //     // goodsCode: '',
      //     // supplyPrice: '',
      //     // skuImg: ''
      //     // 用老的数据替换新的这几个值
      //     let { stock, salePrice, saleMemPrice, goodsCode, supplyPrice, skuImg } = oldData
      //     newData = { ...newData, stock, salePrice, saleMemPrice, goodsCode, supplyPrice, skuImg }
      //     console.log(JSON.stringify(newData))
      //   }
      // }

      for (let i = 0; i < newDataList.length; i++) {
        let key = this.getKeyByTdList(newDataList[i].tdList)
        if (this.oldTableMap.get(key)) {
          let oldData = this.oldTableMap.get(key)
          // stock: '',
          // salePrice: '',
          // saleMemPrice: '',
          // goodsCode: '',
          // supplyPrice: '',
          // skuImg: ''
          // 用老的数据替换新的这几个值
          let { stock, salePrice, saleMemPrice, goodsCode, supplyPrice, skuImg } = oldData
          newDataList[i] = { ...newDataList[i], stock, salePrice, saleMemPrice, goodsCode, supplyPrice, skuImg }
        }
      }

      // 拼装过了 返回拼装的新结构
      // 没拼装过 返回老数据结构
      return newDataList.length > 0 ? newDataList : dataList
    },

    // 控制合并表格的行和列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
        id: item.skuObj[0].typeId,
        typeDataStr: item.id,
        specName: item.specName,
        skuList: []
      }

      for (let i = 0; i < item.skuObj.length; i++) {
        handleParam.skuList.push({
          sort: i,
          skuText: item.skuObj[i].skuText,
          type: 'spec'
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
      this.initData()
    },

    // 保存属性数据
    async saveAttrData(handleParam) {

      let param = {
        jsonParam: JSON.stringify(handleParam)
      }
      const { data } = await postMethod('/bu/goodSpec/update', param)
    },

    // 添加属性名
    addAttrNameInput() {
      this.addAttrParam.push({
        // 各个属性 id为空表示新增
        // id: '',
        typeDataStr: this.dataForm.typeId2,
        specName: '',
        specSort: this.addAttrParam.length,
        specValueWarningStr: '',
        disabled: false,
        skuList: [
          {
            sort: 0,
            skuText: '',
            type: 'spec'
          }
        ]
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
        skuObj: [
          {
            isChecked: true,
            skuText: specValue,
            typeName: specName
          }
        ]
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
