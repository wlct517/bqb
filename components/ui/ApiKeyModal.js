'use client';

import { useState, useEffect } from 'react';

export default function ApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 监听打开模态框的事件
  useEffect(() => {
    const handleOpenModal = () => {
      if (typeof window !== 'undefined') {
        const savedApiKey = localStorage.getItem('deepseekApiKey') || '';
        setApiKey(savedApiKey);
        setIsOpen(true);
      }
    };
    
    window.addEventListener('openApiKeyModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openApiKeyModal', handleOpenModal);
    };
  }, []);
  
  // 监听ESC键关闭模态框
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  // 关闭模态框
  const closeModal = () => {
    setIsOpen(false);
  };
  
  // 保存API密钥
  const saveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepseekApiKey', apiKey);
      
      // 显示成功提示
      setSuccessMessage('API密钥已成功保存');
      
      // 3秒后关闭模态框并清除提示
      setTimeout(() => {
        setSuccessMessage('');
        closeModal();
      }, 2000);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">设置 DeepSeek API 密钥</h3>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1">
              API 密钥
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="apiKeyInput"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="请输入您的 DeepSeek API 密钥"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-4">
            <p className="text-sm text-pink-800">
              <i className="fas fa-info-circle mr-2"></i>
              请输入您的 DeepSeek API 密钥以启用AI神回复功能
            </p>
            <a 
              href="https://platform.deepseek.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-sm text-pink-600 hover:text-pink-800"
            >
              <i className="fas fa-external-link-alt mr-1"></i>
              前往DeepSeek官网获取API密钥
            </a>
          </div>
          
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {successMessage}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={closeModal}
            >
              取消
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
              onClick={saveApiKey}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}