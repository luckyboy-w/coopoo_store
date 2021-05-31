/**
 * 把一个树的子list的树结构转换成全平级的list结构
 */
export function treeChildToList(tree, list) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children == null || tree[i].children.length == 0) {
      list.push(tree[i])
    } else {
      treeChildToList(tree[i].children, list)
    }
  }
}

// 定义一个深拷贝函数  接收目标target参数
export function deepCopy(target) {
  // 定义一个变量
  let result
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepCopy(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {}
      for (let i in target) {
        result[i] = deepCopy(target[i])
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target
  }
  // 返回最终结果
  return result
}

// 数组中按照对象的某属性 去重
export function uniqueObjByAttr(array, property) {
  // 标记是否加过的map
  const map = new Map()
  return array.filter(item => !map.has(item[property]) && map.set(item[property], '任意占位值'))
}

/*
 * 根据数组对象属性删除对应项
 * @param {Array} arr - 数组对象
 * @param {String} attr - 属性
 * @param {} value - 属性值
 * @return void
 */
export function removeByValue(arr, attr, value) {
  var index = 0
  for (var i in arr) {
    if (arr[i][attr] == value) {
      index = i
      break
    }
  }
  arr.splice(index, 1)
}
