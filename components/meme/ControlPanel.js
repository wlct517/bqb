'use client';

import { useState, useEffect } from 'react';

export default function ControlPanel() {
  const [textColor, setTextColor] = useState('#4B3621');
  const [model, setModel] = useState('deepseek-chat');
  const [exportedImages, setExportedImages] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // 从localStorage读取模型设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModel = localStorage.getItem('selectedDeepseekModel') || 'deepseek-chat';
      setModel(savedModel);
    }
  }, []);
  
  // 处理文本颜色变化
  const handleColorChange = (e) => {
    const color = e.target.value;
    setTextColor(color);
    
    // 更新所有表情包文本的颜色
    document.querySelectorAll('.meme-text').forEach(element => {
      element.style.color = color;
    });
  };
  
  // 处理模型变化
  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDeepseekModel', selectedModel);
    }
  };
  
  // 重置所有表情包
  const resetAllMemes = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
  // 配置API密钥
  const configureApiKey = () => {
    // 触发模态框显示
    const event = new CustomEvent('openApiKeyModal');
    window.dispatchEvent(event);
  };
  
  // 导出所有表情包
  const exportAllMemes = async () => {
    if (typeof window === 'undefined' || !window.html2canvas) {
      alert('导出功能需要html2canvas库，请确保页面已完全加载');
      return;
    }
    
    setIsExporting(true);
    setExportedImages([]);
    
    try {
      // 导出第一个表情包
      const meme1Container = document.getElementById('meme1Container');
      const canvas1 = await window.html2canvas(meme1Container, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        logging: false,
        onclone: function(clonedDoc) {
          const clonedText = clonedDoc.getElementById('meme1Text');
          prepareClonedElement(clonedText);
          
          // 隐藏克隆中的按钮
          hideClonedButtons(clonedDoc);
        }
      });
      
      // 下载第一个表情包
      downloadCanvas(canvas1, '表情包1.png');
      setExportedImages(prev => [...prev, '表情包1.png']);
      
      // 延迟2秒后导出第二个表情包
      setTimeout(async () => {
        // 导出第二个表情包
        const meme2Container = document.getElementById('meme2Container');
        const canvas2 = await window.html2canvas(meme2Container, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          logging: false,
          onclone: function(clonedDoc) {
            const clonedText = clonedDoc.getElementById('meme2Text');
            prepareClonedElement(clonedText);
            
            // 隐藏克隆中的按钮
            hideClonedButtons(clonedDoc);
          }
        });
        
        // 下载第二个表情包
        downloadCanvas(canvas2, '表情包2.png');
        setExportedImages(prev => [...prev, '表情包2.png']);
        
        // 3秒后隐藏导出状态
        setTimeout(() => {
          setIsExporting(false);
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('导出图片时出错:', error);
      alert('导出图片时出错，请重试');
      setIsExporting(false);
    }
  };
  
  // 辅助函数：准备克隆元素
  const prepareClonedElement = (element) => {
    if (element) {
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.overflow = 'visible';
      element.style.maxHeight = 'none';
      
      // 调整位置
      const currentTransform = element.style.transform;
      if (currentTransform && currentTransform.includes('translate')) {
        element.style.transform = currentTransform.replace(
          /translate\\(-50%, -50%\\)/,
          'translate(-50%, -60%)'
        );
      }
    }
  };
  
  // 辅助函数：隐藏克隆中的按钮
  const hideClonedButtons = (doc) => {
    const buttons = doc.querySelectorAll('.copy-btn, .finish-btn, .cancel-btn');
    buttons.forEach(btn => {
      btn.style.display = 'none';
    });
  };
  
  // 辅助函数：下载Canvas为图片
  const downloadCanvas = (canvas, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="card rounded-xl p-5 mt-8">
      <div className="flex items-center justify-between flex-nowrap gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium whitespace-nowrap">文字颜色：</span>
          <input 
            type="color" 
            value={textColor} 
            onChange={handleColorChange}
            className="w-8 h-8 rounded cursor-pointer" 
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium whitespace-nowrap">DeepSeek模型：</span>
          <div className="relative inline-block">
            <select 
              value={model}
              onChange={handleModelChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-1 px-2 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="deepseek-chat">DeepSeek V3</option>
              <option value="deepseek-reasoner">DeepSeek R1 (推理)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 shrink-0">
          <button 
            onClick={resetAllMemes}
            className="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 text-sm"
          >
            <i className="fas fa-undo mr-1"></i>重置全部
          </button>
          
          <button 
            onClick={exportAllMemes}
            disabled={isExporting}
            className={\`px-2 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-200 text-sm \${isExporting ? 'opacity-50' : ''}\`}
          >
            {isExporting ? (
              <><i className="fas fa-spinner fa-spin mr-1"></i>导出中</>
            ) : (
              <><i className="fas fa-download mr-1"></i>导出全部图片</>
            )}
          </button>
          
          <button 
            onClick={configureApiKey}
            className="px-2 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition duration-200 text-sm"
          >
            <i className="fas fa-key mr-1"></i>设置API密钥
          </button>
        </div>
      </div>
      
      {/* 导出状态显示 */}
      {isExporting && (
        <div className="mt-4 text-center py-4">
          {exportedImages.length === 0 && (
            <div className="flex flex-col items-center">
              <div className="loading-spinner"></div>
              <p className="mt-2">正在生成第一张表情包...</p>
            </div>
          )}
          
          {exportedImages.length === 1 && (
            <div className="flex flex-col items-center">
              <p className="text-green-500 mb-2">
                <i className="fas fa-check-circle"></i> 第一张表情包已下载
              </p>
              <div className="loading-spinner"></div>
              <p className="mt-2">正在生成第二张表情包...</p>
            </div>
          )}
          
          {exportedImages.length === 2 && (
            <p className="text-green-500">
              <i className="fas fa-check-circle"></i> 两张表情包已全部下载完成！
            </p>
          )}
        </div>
      )}
    </div>
  );
}