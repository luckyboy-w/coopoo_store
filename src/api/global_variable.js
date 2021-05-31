const shopStatusList = [
  { id: '1', label: '正常经营' },
  { id: '2', label: '违规关闭' },
  { id: '3', label: '到期关闭' }
]

const shopStatusMap = {
  1: '正常经营',
  2: '违规关闭',
  3: '到期关闭',
  '': '-'
}

const enableList = [
  { id: '1', label: '启用' },
  { id: '0', label: '禁用' }
]

const enableMap = {
  '-1': '全部',
  '1': '启用',
  '0': '禁用'
}

const advertLocationList = [
  { id: '1', label: '首页头部' },
  { id: '2', label: '首页腰部' },
  { id: '3', label: '个人中心' }
]

const advertLocationMap = {
  '1': '首页头部',
  '2': '首页腰部',
  '3': '个人中心'
}

const verifyProvinceMap = {
  10: '未审核',
  20: '审核中',
  21: '审核不通过',
  30: '审核通过'
}

const verifyProvinceLevelMap = {
  1: 'A类',
  2: 'B类',
  3: 'C类',
  4: 'D类',
  5: 'E类',
  6: 'EF类',
  7: 'EF-E类'
}

const pushTypeList = [
  { id: '1', label: '平台推送' },
  { id: '2', label: '极光推送' }
]

const pushTypeMap = {
  1: '平台推送',
  2: '极光推送'
}

export default {
  shopStatusList,
  shopStatusMap,
  verifyProvinceMap,
  verifyProvinceLevelMap,
  advertLocationList,
  advertLocationMap,
  pushTypeList,
  pushTypeMap,
  enableList,
  enableMap
}
