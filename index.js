/*
 * @description CropSprite
 * @author minh8023 <https://github.com/minh8023>
 */
const images = require("images")
const stripJsonComments = require('strip-json-comments')
const fs = require('fs')
const filePath = './src', outPath = './dist'
function getJson(name) {
  let pagesJson = {}
  console.time(`读取【${name}】耗时`)
  try {
    // Egert
    pagesJson = JSON.parse(stripJsonComments(fs.readFileSync(`${filePath}/${name}.json`, 'utf8')))
  } catch (error) {
    // laya
    pagesJson = JSON.parse(stripJsonComments(fs.readFileSync(`${filePath}/${name}.atlas`, 'utf8')))
  }
  const key = Object.keys(pagesJson.frames)
  const values =  Object.values(pagesJson.frames)
  return Array.from(key, (item, index)=> {
    return {
      name: item,
      ...values[index]
    }
  })
}
/**
 * 裁剪图片
 */
function cropSprite(arr, name) {
  const img = images(`${filePath}/${name}.png`)
  console.timeEnd(`读取【${name}】耗时`)
  const path = `${outPath}/${name}`
  if (!fs.existsSync(outPath)) fs.mkdirSync(outPath)
  if (!fs.existsSync(path)) fs.mkdirSync(`${outPath}/${name}`)
  console.time(`裁剪【${name}】耗时`)
  arr.map((item) => {
    if (item.spriteSourceSize) {
      cropLaya(img, item, name)
    } else {
      cropEgert(img, item, name)
    }
  })
  console.timeEnd(`裁剪【${name}】耗时`)
}
/**
 * 裁剪laya的图
 */
function cropLaya (img, ele, name) {
  const res = images(img, ele.frame.x, ele.frame.y, ele.frame.w, ele.frame.h)
  images(ele.sourceSize.w, ele.sourceSize.h)
  .draw(res, ele.spriteSourceSize.x, ele.spriteSourceSize.y)
  .save(`${outPath}/${name}/${ele.name}`)
}
/**
 * 裁剪Egert的图
 */
function cropEgert (img, ele, name) {
  const res = images(img, ele.x, ele.y, ele.w, ele.h) // 先剪裁出来
  images(ele.sourceW, ele.sourceH) // 新建实际大小空白图
  .draw(res, ele.offX, ele.offY) // 把剪裁出来的图画上去
  .save(`${outPath}/${name}/${ele.name}.png`)
}
const argv = process.argv.slice(2)
argv.map((name) => {
  cropSprite(getJson(name), name)
})
