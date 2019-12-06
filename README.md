# wepy markdown 编译器

## 安装

```
npm install @wepy/compiler-markdown --save-dev
```

## 配置`wepy.config.js`

```
module.exports = {
    "compilers": {
        markdown: {
            // 其他参考marked文档
            // 样式部分参数
            style: {
              lang: 'css',
              rootClass: 'markdown-body',
              // your markdown css content
              content: ''
            }
        }
    }
};
```

## 参数说明

[marked](https://marked.js.org/#/README.md#README.md)