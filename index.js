const marked = require('marked')
const WxmlRenderer = require('./lib/renderer')
const fs = require('fs')
const path = require('path')

module.exports = function (options = {}) {
  // initial style option
  let styleOption = Object.assign({
    lang: 'css',
    rootClass: 'markdown-body',
    content: fs.readFileSync(
      path.resolve(__dirname, 'theme/github.css'),
      'utf8'
    )
  }, options.style || {})

  // initial marked option
  marked.setOptions(Object.assign({
    renderer: new WxmlRenderer(),
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }, options || {}))

  return function () {
    this.register('wepy-compiler-markdown', function (node, ctx) {
      let stylesNode = ctx.sfc.styles
      let compiledTemplateCode = marked(node.content)

      try{
        stylesNode = stylesNode || []
        
        stylesNode.unshift({
          lang: styleOption.lang,
          content: styleOption.content,
          type: 'style'
        })
      } catch (err) {
        return Promise.reject(err)
      }

      compiledTemplateCode = `<view class="${styleOption.rootClass}">${compiledTemplateCode}</view>`

      node.content = compiledTemplateCode
      node.compiled = {
        code: compiledTemplateCode
      }
      return Promise.resolve(node)
    })
  }
}