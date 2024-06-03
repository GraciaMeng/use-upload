# Vue-use-upload

A Vue Upload Hook that supports slice upload & cache breakpoint resume by web worker

[![NPM version][image-1]][1]
[![npm](https://img.shields.io/github/issues/GraciaMeng/use-upload)](https://github.com/GraciaMeng/use-upload/issues)
![GitHub](https://img.shields.io/github/license/GraciaMeng/use-upload)

English | [简体中文](https://github.com/GraciaMeng/use-upload/blob/main/packages/vue-use-upload/README.zh-CN.md)

</div>

## 📚 Documentation

- [English](https://github.com/GraciaMeng/use-upload/blob/main/packages/vue-use-upload/README.md)
- [中文](https://github.com/GraciaMeng/use-upload/blob/main/packages/vue-use-upload/README.zh-CN.md)

## ✨ Features

- Support web worker to read large files, avoiding browser parsing freezes
- Support file reading hash, upload by hash value slices
- Customize upload request, support retry on failure
- Support interrupted upload, cache breakpoint resume
- Support remote merge initiation
- Use TypeScript to build, provide complete type definition files

## 📦 Install

```bash
$ npm install --save vue-use-upload
# or
$ yarn add vue-use-upload
# or
$ pnpm add vue-use-upload
```

## 🔨 Usage

```ts
import { useMerge, useUpload } from 'vue-use-upload';
```

[1]: https://www.npmjs.com/package/vue-use-upload
[image-1]: https://img.shields.io/npm/v/vue-use-upload.svg?style=flat
