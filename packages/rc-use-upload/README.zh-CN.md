# Rc-use-upload

一个支持由web worker实现切片上传、缓存断点续传的 React Upload Hook

[![NPM version][image-1]][1]
[![npm](https://img.shields.io/github/issues/GraciaMeng/use-upload)](https://github.com/GraciaMeng/use-upload/issues)
![GitHub](https://img.shields.io/github/license/GraciaMeng/use-upload)

[English](https://github.com/GraciaMeng/rc-use-upload/blob/main/packages/rc-use-upload/README.md) | 简体中文

</div>

## 📚 文档

- [English](https://github.com/GraciaMeng/use-upload/blob/main/packages/rc-use-upload/README.md)
- [中文](https://github.com/GraciaMeng/use-upload/blob/main/packages/rc-use-upload/README.zh-CN.md)

## ✨ 特性

- 支持web worker读取大文件，避免浏览器解析时卡顿
- 支持文件读取hash，通过hash值切片上传
- 自定义上传请求，支持失败重试
- 支持中断上传、缓存断点续传
- 支持远程合并发起
- 使用 TypeScript 构建，提供完整的类型定义文件

## 📦 安装

```bash
$ npm install --save rc-use-upload
# or
$ yarn add rc-use-upload
# or
$ pnpm add rc-use-upload
```

## 🔨 使用

```js
import { useMerge, useUpload } from 'rc-use-upload';
```

[1]: https://www.npmjs.com/package/rc-use-upload
[image-1]: https://img.shields.io/npm/v/rc-use-upload.svg?style=flat
