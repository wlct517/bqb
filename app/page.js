'use client';

import { useEffect } from 'react';
import Header from '../components/ui/Header';
import MemeContainer from '../components/meme/MemeContainer';
import ControlPanel from '../components/meme/ControlPanel';
import Instructions from '../components/ui/Instructions';
import ApiKeyModal from '../components/ui/ApiKeyModal';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // 初始化本地存储
    if (typeof window !== 'undefined') {
      // 确保在客户端环境下运行
      window.deepseekApiKey = localStorage.getItem('deepseekApiKey') || '';
      window.selectedModel = localStorage.getItem('selectedDeepseekModel') || 'deepseek-chat';
    }
  }, []);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" strategy="beforeInteractive" />
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 第一个表情包容器 */}
          <MemeContainer 
            type="meme1" 
            title="书封面表情包"
            imgSrc="/images/book-cover.jpg" 
            defaultText="男朋友 不听话怎么办"
            placeholder="例如：男朋友 不听话怎么办"
            maxLength={20}
          />
          
          {/* 第二个表情包容器 */}
          <MemeContainer 
            type="meme2" 
            title="书内页表情包"
            imgSrc="/images/book-page.jpg" 
            defaultText="换个 男朋友"
            placeholder="例如：换个 男朋友"
            maxLength={20}
            showAiButton={true}
          />
        </div>
        
        {/* 控制面板 */}
        <ControlPanel />
        
        {/* 使用说明 */}
        <Instructions />
      </main>
      
      {/* API密钥配置模态框 */}
      <ApiKeyModal />
    </>
  );
}