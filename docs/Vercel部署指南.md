# 神回复表情包生成器 - Vercel部署指南

本指南将帮助你将神回复表情包生成器项目部署到Vercel平台。

## 准备工作

1. 确保你已经有一个GitHub账号
2. 确保你已经有一个Vercel账号（可以直接使用GitHub账号登录）
3. 获取DeepSeek API密钥（从https://platform.deepseek.com/）

## 步骤1：将项目推送到GitHub

1. 在GitHub上创建一个新的仓库
2. 在本地初始化Git仓库并推送代码：

```bash
cd 项目目录
git init
git add .
git commit -m "初始化项目"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

## 步骤2：在Vercel上导入项目

1. 登录Vercel（https://vercel.com/）
2. 点击"Add New..."，然后选择"Project"
3. 从GitHub仓库列表中找到并选择你的项目
4. 设置项目配置：
   - 框架预设：Next.js
   - 根目录：./（默认）
   - 构建命令：npm run build（默认）
   - 输出目录：.next（默认）

## 步骤3：添加环境变量

1. 在Vercel项目设置界面，找到"Environment Variables"部分
2. 添加以下环境变量：
   - 名称：`DEEPSEEK_API_KEY`
   - 值：你的DeepSeek API密钥
3. 选择"Production"和"Preview"环境
4. 点击"Add"保存环境变量

## 步骤4：部署项目

1. 点击"Deploy"按钮开始部署
2. 等待部署完成（通常只需几分钟）
3. 部署完成后，Vercel会提供一个可访问的URL

## 部署成功后

部署成功后，你可以通过Vercel提供的域名访问你的应用程序，例如：
`https://你的项目名.vercel.app`

你还可以在Vercel控制面板中执行以下操作：
- 查看部署日志
- 监控性能
- 添加自定义域名
- 配置自动部署（当GitHub仓库更新时）

## 注意事项

1. 确保你的DeepSeek API密钥是有效的，以便AI功能正常工作
2. 如果遇到CORS问题，可能需要在DeepSeek平台上将你的Vercel域名添加到允许列表中
3. 每次修改代码并推送到GitHub后，Vercel会自动重新部署

## 问题排查

如果部署遇到问题：

1. 检查Vercel部署日志，寻找错误信息
2. 确认环境变量是否正确设置
3. 验证package.json中的依赖是否正确
4. 确保Next.js配置文件正确

## 更新部署

要更新已部署的项目，只需将更改推送到GitHub仓库：

```bash
git add .
git commit -m "更新内容描述"
git push
```

Vercel将自动检测更改并重新部署项目。