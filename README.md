# 客厅图志 · Living Room Atlas

一座关于「客厅」的概念档案 —— 4 形态 × 5 分类轴 × 32 情绪，200 条目 / 250 图像。

## 🌐 在线访问

**https://b4-living-room.2736024602.workers.dev**

> 部署方式：本地 `npm run build` 后执行 `npx wrangler deploy`（使用根目录 `wrangler.toml`，发布 `dist/`）。

## 第二版网站 · living-room-v2（⚠️ 暂时版）

`living-room-v2/` 是**另一个独立网站**——「客厅关系档案 / LIVING ROOM」第二版（纯静态 HTML/JS，无构建步骤），**目前仍在修改中，内容为暂时版，后续还会再做改动**。

- 在线演示：**https://living-room-v2.2736024602.workers.dev**
- 网页文件在 `living-room-v2/site/`，部署配置 `living-room-v2/wrangler.toml`（与主站互不影响）
- 更新部署：在 `living-room-v2/` 目录下执行 `npx wrangler deploy`
- 该网站**不参与主站构建**，主站的构建与部署完全不受影响

## 技术栈

- Vite 7 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Three.js（3D 客厅场景）

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建（输出到 dist/）
npm run preview  # 预览构建产物
```
