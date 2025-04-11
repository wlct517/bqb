# 神回复表情包生成器

这是一个基于Next.js的神回复表情包生成工具，可以为用户自动生成有趣的"神回复"表情包。

## 功能特点

- 书封面与书内页两种表情包模板
- 支持自定义文字内容、位置和颜色
- DeepSeek AI生成神回复功能
- 支持导出和复制表情包
- 自适应设计，支持各种设备

## 使用技术

- Next.js 14 (App Router)
- React 18
- TailwindCSS
- html2canvas
- DeepSeek API接口

## 本地开发

1. 克隆仓库
2. 安装依赖
   ```bash
   npm install
   ```
3. 创建`.env.local`文件并设置API密钥
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   ```
4. 启动开发服务器
   ```bash
   npm run dev
   ```
5. 打开 http://localhost:3000

## 部署

项目可以部署到Vercel平台：

1. 在Vercel中导入此GitHub仓库
2. 设置环境变量`DEEPSEEK_API_KEY`
3. 部署

## 作者

王老禅头