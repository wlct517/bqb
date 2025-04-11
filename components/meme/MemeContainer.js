'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { adjustFontSize, applyPositionData } from '../../utils/memeUtils';
import AiResponseButton from './AiResponseButton';

// 默认位置数据
const defaultPositions = {
  meme1: [
    { x: 108.5, y: 192 },
    { x: 230.5, y: 170 },
    { x: 230.5, y: 295 },
    { x: 110.5, y: 294 }
  ],
  meme2: [
    { x: 0, y: 106 },
    { x: 129.5, y: 90 },
    { x: 161.5, y: 215 },
    { x: 3.5, y: 242 }
  ]
};

export default function MemeContainer({ 
  type, 
  title, 
  imgSrc, 
  defaultText, 
  placeholder, 
  maxLength, 
  showAiButton = false 
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [text, setText] = useState(defaultText);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [positions, setPositions] = useState(defaultPositions[type]);
  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiResponses, setAiResponses] = useState([]);

  // 处理文本输入变化
  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      updateMemeText(newText);
    }
  };

  // 更新表情包文本
  const updateMemeText = (newText) => {
    if (textRef.current) {
      const formattedText = newText.split(' ').join('\n');
      textRef.current.textContent = formattedText;
      
      // 应用调整字体大小但跳过自动换行
      adjustFontSize(textRef.current, newText, type, true);
    }
  };

  // 开始自定义区域模式
  const startCustomization = () => {
    if (isCustomizing) return;
    setIsCustomizing(true);
    
    // 重置标记和线条
    setMarkers([]);
    setLines([]);
  };

  // 处理区域点击定义文本位置
  const handleAreaClick = (e) => {
    if (markers.length >= 4) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newMarker = { x, y };
    const newMarkers = [...markers, newMarker];
    setMarkers(newMarkers);
    
    // 绘制连接线
    if (newMarkers.length > 1) {
      drawLineBetweenMarkers(
        newMarkers[newMarkers.length - 2], 
        newMarkers[newMarkers.length - 1]
      );
    }
    
    // 如果有4个标记，连接最后一个和第一个
    if (newMarkers.length === 4) {
      drawLineBetweenMarkers(newMarkers[3], newMarkers[0]);
      updateTextPosition(newMarkers);
    }
  };

  // 绘制线段
  const drawLineBetweenMarkers = (markerA, markerB) => {
    const dx = markerB.x - markerA.x;
    const dy = markerB.y - markerA.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    const line = {
      left: markerA.x,
      top: markerA.y,
      width: length,
      angle: angle
    };
    
    setLines(prevLines => [...prevLines, line]);
  };

  // 更新文本位置
  const updateTextPosition = (currentMarkers = markers) => {
    if (currentMarkers.length < 4 || !textRef.current) return;
    applyPositionData(textRef.current, currentMarkers, containerRef.current);
  };

  // 完成自定义区域
  const finishCustomization = () => {
    if (markers.length < 4) {
      alert('请标记4个点来定义文字区域');
      return;
    }

    // 保存当前位置
    setPositions(markers);
    
    // 更新文本位置
    updateTextPosition();
    
    // 添加自定义旋转类
    textRef.current.classList.add('text-custom-rotation');
    
    // 退出自定义模式
    cleanupCustomization();
  };

  // 取消自定义
  const cancelCustomization = () => {
    cleanupCustomization();
  };

  // 清理自定义模式
  const cleanupCustomization = () => {
    setIsCustomizing(false);
    setMarkers([]);
    setLines([]);
  };

  // 复制表情包到剪贴板
  const copyMemeToClipboard = async () => {
    if (typeof window === 'undefined' || !window.html2canvas) {
      alert('复制功能需要html2canvas库，请确保页面已完全加载');
      return;
    }

    // 保存原始样式
    const originalStyle = {
      overflow: textRef.current.style.overflow,
      maxHeight: textRef.current.style.maxHeight,
      zIndex: textRef.current.style.zIndex,
      opacity: textRef.current.style.opacity,
      visibility: textRef.current.style.visibility
    };
    
    // 临时修改样式以确保导出正确
    textRef.current.style.overflow = 'visible';
    textRef.current.style.maxHeight = 'none';
    textRef.current.style.zIndex = '10';
    textRef.current.style.opacity = '1';
    textRef.current.style.visibility = 'visible';
    
    try {
      // 使用html2canvas将表情包转换为canvas
      const canvas = await window.html2canvas(containerRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        logging: false,
        onclone: function(clonedDoc) {
          const clonedText = clonedDoc.querySelector(\`#\${type}Text\`);
          if (clonedText) {
            clonedText.style.opacity = '1';
            clonedText.style.visibility = 'visible';
            clonedText.style.overflow = 'visible';
            clonedText.style.maxHeight = 'none';
            
            // 解析当前transform值并调整位置
            const currentTransform = clonedText.style.transform;
            if (currentTransform && currentTransform.includes('translate')) {
              clonedText.style.transform = currentTransform.replace(
                /translate\\(-50%, -50%\\)/,
                'translate(-50%, -60%)'
              );
            }
          }
          
          // 隐藏克隆中的按钮
          const clonedButtons = clonedDoc.querySelectorAll('.copy-btn, .finish-btn, .cancel-btn');
          clonedButtons.forEach(btn => {
            btn.style.display = 'none';
          });
        }
      });

      // 将canvas转为Blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      
      // 创建ClipboardItem对象
      const item = new ClipboardItem({ 'image/png': blob });
      
      // 写入剪贴板
      await navigator.clipboard.write([item]);
      
      alert('表情包已成功复制到剪贴板！');
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      alert('复制失败，请重试');
    } finally {
      // 恢复原始样式
      textRef.current.style.overflow = originalStyle.overflow;
      textRef.current.style.maxHeight = originalStyle.maxHeight;
      textRef.current.style.zIndex = originalStyle.zIndex;
      textRef.current.style.opacity = originalStyle.opacity;
      textRef.current.style.visibility = originalStyle.visibility;
    }
  };

  // 设置AI回复
  const setAiResponse = (response) => {
    setText(response);
    updateMemeText(response);
    setDropdownOpen(false);
  };

  // 更新AI回复列表
  const updateAiResponses = (responses) => {
    setAiResponses(responses);
    if (responses && responses.length > 0) {
      setAiResponse(responses[0]);
    }
  };

  // 初始化
  useEffect(() => {
    if (containerRef.current && textRef.current) {
      // 应用初始位置
      setTimeout(() => {
        applyPositionData(textRef.current, positions, containerRef.current);
        adjustFontSize(textRef.current, text, type, true);
        textRef.current.style.opacity = '1';
      }, 500);
    }
  }, []);

  // 当isCustomizing改变时更新classNames
  const containerClassNames = \`meme-container mb-4 \${isCustomizing ? 'customize-mode' : ''}\`;

  return (
    <div className="card rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      
      <div id={\`\${type}Container\`} ref={containerRef} className={containerClassNames}>
        <Image 
          src={imgSrc}
          alt={\`\${title} Meme\`}
          className="meme-image"
          width={300}
          height={300}
          priority
        />
        
        <div 
          id={\`\${type}Text\`} 
          ref={textRef} 
          className={\`meme-text \${type}-text\`}
        >
          {defaultText.split(' ').join('\n')}
        </div>
        
        <button 
          className="copy-btn"
          onClick={copyMemeToClipboard}
        >
          <i className="fas fa-copy"></i> 复制
        </button>
        
        {isCustomizing && (
          <>
            <div 
              className="area-overlay"
              onClick={handleAreaClick}
            ></div>
            
            {markers.map((marker, i) => (
              <div 
                key={i}
                className="text-area-marker"
                style={{
                  left: \`\${marker.x}px\`,
                  top: \`\${marker.y}px\`
                }}
              ></div>
            ))}
            
            {lines.map((line, i) => (
              <div 
                key={i}
                className="text-area-line"
                style={{
                  left: \`\${line.left}px\`,
                  top: \`\${line.top}px\`,
                  width: \`\${line.width}px\`,
                  transform: \`rotate(\${line.angle}deg)\`,
                  transformOrigin: '0 0'
                }}
              ></div>
            ))}
            
            <div className="absolute top-2 left-0 right-0 text-center text-white text-sm font-bold px-2 py-1 bg-pink-500 bg-opacity-70 rounded-lg z-20">
              点击4个点确定区域（上方2点决定文字方向）
            </div>
            
            <button 
              className="finish-btn"
              onClick={finishCustomization}
            >
              完成
            </button>
            
            <button 
              className="cancel-btn"
              onClick={cancelCustomization}
            >
              取消
            </button>
          </>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor={\`\${type}Input\`} className="text-sm font-medium">
            {type === 'meme1' ? '书名文字' : '回应文字'}
            <span className="text-xs text-gray-500 ml-2">(输入空格可换行)</span>
          </label>
          <div className="text-xs text-gray-500">
            <span className="char-counter">{text.length}</span>/{maxLength}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            id={\`\${type}Input\`}
            className="w-full px-4 py-2 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            placeholder={placeholder}
            value={text}
            onChange={handleTextChange}
            maxLength={maxLength}
          />
          
          {showAiButton && (
            <button 
              id="toggleDropdown" 
              className={\`dropdown-toggle absolute right-2 top-1/2 transform -translate-y-1/2 \${aiResponses.length > 0 ? 'animate-pulse' : ''}\`}
              aria-label="显示更多回复选项"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className={\`fas fa-chevron-\${dropdownOpen ? 'up' : 'down'}\`}></i>
            </button>
          )}
          
          {showAiButton && (
            <div 
              className="ai-dropdown"
              style={{ display: dropdownOpen ? 'block' : 'none' }}
            >
              <div className="ai-dropdown-header">选择一个神回复</div>
              {aiResponses.map((response, index) => (
                <div 
                  key={index}
                  className="ai-dropdown-item"
                  onClick={() => setAiResponse(response)}
                >
                  {response}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-2 w-full">
          <button 
            className="px-3 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition duration-200"
            onClick={startCustomization}
          >
            <i className="fas fa-crop-alt mr-1"></i>自定义区域
          </button>
          
          {showAiButton && (
            <AiResponseButton 
              inputText={type === 'meme1' ? text : ''}
              onResponsesReceived={updateAiResponses}
            />
          )}
        </div>
      </div>
    </div>
  );
}