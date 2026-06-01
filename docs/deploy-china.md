# 中国大陆可访问部署方案

Quant Navigator 是纯前端静态站点，`npm run build` 会输出 `dist/`，可以部署到任意静态托管平台。为了兼容不同访问环境，建议同时保留海外部署和中国大陆部署。

## 为什么 Vercel 在中国大陆访问不稳定

Vercel 很适合海外访问和快速预览，但它的默认域名和海外边缘网络在中国大陆可能出现 DNS 解析慢、连接不稳定、访问延迟高、部分网络不可达等情况。对国内用户来说，腾讯云、阿里云等国内云厂商的静态托管通常更稳定。

## 推荐部署组合

- 海外访问：Vercel。
- 中国大陆访问：腾讯云 EdgeOne Pages、腾讯云 COS 静态网站、阿里云 OSS 静态网站。
- 离线 Windows 使用：把 `dist/` 打包成 zip，或后续用 Electron 封装桌面版。

## 构建静态文件

```bash
npm install
npm run build
```

构建产物在：

```text
dist/
```

当前 `vite.config.ts` 使用 `base: './'`，因此静态资源采用相对路径，便于部署到任意目录、对象存储 Bucket 子路径或 GitHub Pages 子路径。

## 腾讯云 EdgeOne Pages 部署步骤

1. 将项目 push 到 GitHub。
2. 打开腾讯云 EdgeOne Pages。
3. 新建 Pages 项目并连接 GitHub 仓库。
4. 构建框架选择 `Vite` 或自定义构建。
5. 构建命令填写：

```bash
npm run build
```

6. 输出目录填写：

```text
dist
```

7. 如需账号同步收藏，在环境变量中配置：

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

8. 部署完成后访问 EdgeOne Pages 分配的域名或绑定自己的已备案域名。

## 腾讯云 COS 静态网站部署步骤

1. 在腾讯云 COS 创建 Bucket。
2. 开启静态网站功能。
3. 默认首页设置为：

```text
index.html
```

4. 本地运行：

```bash
npm run build
```

5. 将 `dist/` 目录内的所有文件上传到 Bucket 根目录。
6. 设置对象访问权限，确保用户可以读取静态文件。
7. 使用 COS 静态网站访问域名或绑定自定义域名。

如果后续配置 CDN，请确保缓存刷新后再验证新版本。

## 阿里云 OSS 静态网站部署步骤

1. 在阿里云 OSS 创建 Bucket。
2. 开启静态网站托管。
3. 默认首页设置为：

```text
index.html
```

4. 本地运行：

```bash
npm run build
```

5. 将 `dist/` 目录内的所有文件上传到 Bucket 根目录。
6. 设置 Bucket 或对象读权限，确保浏览器可以访问。
7. 使用 OSS 静态网站域名或绑定自定义域名。

如果接入 CDN，请在发布后刷新 CDN 缓存。

## ICP 备案说明

如果使用中国大陆云厂商并绑定自己的域名，通常需要完成 ICP 备案。备案要求会随云厂商、域名、接入方式和监管规则变化，请以腾讯云、阿里云控制台的备案指引为准。

一般经验：

- 使用中国大陆服务器、对象存储静态网站或 CDN 绑定自定义域名，通常需要备案。
- 仅使用平台临时域名时，可能可以先测试访问，但不适合作为长期正式入口。
- 企业内部或团队试用阶段，可以先用平台分配域名、对象存储临时访问域名或离线包。

## 没有备案域名时的临时方案

- 使用 EdgeOne Pages 或对象存储分配的临时域名做内部测试。
- 继续保留 Vercel 作为海外入口。
- 将 `dist/` 压缩成 zip 发给 Windows 用户，由用户离线打开或通过内部静态服务访问。
- 在公司内网、NAS、Nginx、IIS 或静态文件服务器上托管 `dist/`。

## 如何把 dist 上传到静态托管平台

通用规则：

1. 执行 `npm run build`。
2. 打开 `dist/`。
3. 上传 `dist/` 目录中的所有内容，而不是上传 `dist` 文件夹本身。
4. 确保 `index.html` 位于静态网站根目录。
5. 确保 `assets/` 目录和其中的 JS/CSS 文件与 `index.html` 同级。

部署后根目录结构应类似：

```text
index.html
assets/
  index-xxxxx.js
  index-xxxxx.css
```

## 如何验证部署成功

1. 打开部署后的 URL。
2. 确认页面标题显示 `量化导航 Quant Navigator`。
3. 搜索中文关键词，例如 `问询函`、`东方财富`、`因子`。
4. 切换市场：A股、美股、港股、加密、通用工具。
5. 点击收藏，刷新页面后确认收藏仍在。
6. 点击 `只看收藏`，确认筛选结果正确。
7. 点击 Quick Workflows 的打开按钮，确认浏览器请求打开对应站点。
8. 未配置 Supabase 时，确认页面显示本地收藏模式，不显示不可用登录框。
9. 配置 Supabase 时，确认 magic link 登录和账号收藏同步可用。

## 离线 Windows 使用

目前项目是静态前端，离线方式可以先使用静态包：

1. 在开发机运行 `npm run build`。
2. 将 `dist/` 压缩成 zip。
3. 发给 Windows 用户。
4. 用户解压后，可用本地静态服务器打开，或后续封装成 Electron 桌面版。

后续如果要更好的离线体验，建议加入 Electron 或 Tauri 打包流程，把 Quant Navigator 封装为 Windows 桌面应用。
