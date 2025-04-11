'use client';

import { useState, useEffect } from 'react';

export default function AiResponseButton({ inputText, onResponsesReceived }) {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('deepseek-chat');
  
  // 从localStorage读取模型设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModel = localStorage.getItem('selectedDeepseekModel') || 'deepseek-chat';
      setModel(savedModel);
    }
  }, []);
  
  const getAiResponse = async () => {
    if (!inputText) {
      alert('请先在第一个表情包中输入文字');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          model
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API请求失败: HTTP ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      
      if (data.responses && data.responses.length > 0) {
        onResponsesReceived(data.responses);
      } else {
        throw new Error('未能获取有效响应');
      }
    } catch (error) {
      console.error("调用API出错:", error);
      alert(`调用AI接口失败: ${error.message}`);
      onResponsesReceived(["AI生成失败，请重试"]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      className="px-3 py-2 rounded-lg btn-secondary text-gray-800 flex items-center justify-center"
      onClick={getAiResponse}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading-spinner"></span>
      ) : (
        <>
          <i className="fas fa-robot mr-1"></i>
          {model === 'deepseek-reasoner' ? 'DeepSeek R1神回复' : 'DeepSeek V3神回复'}
        </>
      )}
    </button>
  );
}