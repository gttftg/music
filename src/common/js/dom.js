// 元素添加classname
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 当前class是否存在classname
export function hasClass (el, className) {
  // RegExp 对象用于规定在文本中检索的内容。
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // test() 方法检索字符串中的指定值。返回值是 true 或 false。
  return reg.test(el.className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  // name:data-index
  name = prefix + name
  if (val) {
    // 如果有 val 就添加这个 val 到 dom 中
    // name="val"
    return el.setAttribute(name, val)
  } else {
    // 没有 val ，就获取 dom 中的 name
    return el.getAttribute(name)
  }
}

// 能力检测
const elementStyle = document.createElement('div').style

const vendor = (() => {
  // 定义游览器前缀
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // 遍历前缀，如果游览器支持的话，就返回对应 key
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  // 如果都不支持，那肯定是有问题的，返回 false
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  // 如果 vendor 为标准，就不改变 style
  if (vendor === 'standard') {
    return style
  }
  // 否则返回 vender(也就是 webkit Moz O ms 中的一个) + 样式首字母大写
  // 例如：webkit + transform ---> webkitTransform
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
