# Rc-use-upload

A React Upload Hook that supports slice upload & cache breakpoint resume by web worker

[![NPM version][image-1]][1]
[![npm](https://img.shields.io/github/issues/GraciaMeng/use-upload)](https://github.com/GraciaMeng/use-upload/issues)
![GitHub](https://img.shields.io/github/license/GraciaMeng/use-upload)

English | [简体中文](https://github.com/GraciaMeng/use-upload/blob/main/packages/rc-use-upload/README.zh-CN.md)

</div>

## 📚 Documentation

- [English](https://github.com/GraciaMeng/use-upload/blob/main/packages/rc-use-upload/README.md)
- [中文](https://github.com/GraciaMeng/use-upload/blob/main/packages/rc-use-upload/README.zh-CN.md)

## ✨ Features

- Support web worker to read large files, avoiding browser parsing freezes
- Support file reading hash, upload by hash value slices
- Customize upload request, support retry on failure
- Support interrupted upload, cache breakpoint resume
- Support remote merge initiation
- Use TypeScript to build, provide complete type definition files

## 📦 Install

```bash
$ npm install --save rc-use-upload
# or
$ yarn add rc-use-upload
# or
$ pnpm add rc-use-upload
```

## 🔨 Usage

```ts
import { useMerge, useUpload } from 'rc-use-upload';
```

[1]: https://www.npmjs.com/package/rc-use-upload
[image-1]: https://img.shields.io/npm/v/rc-use-upload.svg?style=flat
