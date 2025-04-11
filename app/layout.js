import './globals.css'

export const metadata = {
  title: '神回复表情包生成器',
  description: '一个能够生成有趣神回复表情包的工具，支持AI自动生成回复',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link href="https://cdn.staticfile.org/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen pb-10">
        {children}
      </body>
    </html>
  )
}