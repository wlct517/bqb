// 调整字体大小函数
export function adjustFontSize(element, text, memeType, skipAutoLineBreaks = false) {
  // 获取元素宽度
  const elementWidth = parseFloat(element.style.width || '45');
  
  // 默认基础字体大小
  const baseFontSize = 16;
  
  // 设置最小字体大小
  const MIN_FONT_SIZE = 12;
  let fontSize = baseFontSize;
  
  // 获取当前文本内容及其行数
  const currentText = element.textContent;
  const lines = currentText.split('\n');
  
  // 查找最长的行
  let maxLineLength = 0;
  for (const line of lines) {
    if (line.length > maxLineLength) {
      maxLineLength = line.length;
    }
  }
  
  // 计算文本可用宽度（像素）
  // 元素宽度是百分比，转换为容器宽度的像素值
  const container = element.parentElement;
  const containerWidth = container.clientWidth;
  const availableWidthPx = (containerWidth * elementWidth / 100) * 0.9; // 可用宽度的90%
  
  // 确定最长行适合宽度的最佳字体大小
  // 使用粗略估计：中文字符大致是正方形
  // 调整字体大小以使所有字符适合可用宽度
  if (maxLineLength > 0) {
    // 计算每个字符的可用宽度
    const widthPerChar = availableWidthPx / maxLineLength;
    // 字符刚好适合宽度的字体大小（宽度方面）
    const calculatedSize = widthPerChar * 0.95; // 95%留一些边距
    
    fontSize = calculatedSize;
    
    // 确保不低于最小字体大小
    fontSize = Math.max(MIN_FONT_SIZE, fontSize);
    
    // 对于很短的行，限制最大字体大小
    if (maxLineLength <= 3) {
      fontSize = Math.min(fontSize, baseFontSize * 1.8);
    } else if (maxLineLength <= 5) {
      fontSize = Math.min(fontSize, baseFontSize * 1.5);
    }
  }
  
  // 应用计算出的字体大小
  element.style.fontSize = `${fontSize}px`;
  
  // 确保文本不会被截断
  element.style.whiteSpace = 'pre-wrap';
  element.style.overflow = 'visible';
  element.style.textOverflow = 'clip';
  element.style.wordBreak = 'break-word';
  
  // 对较长文本应用自动换行（如果未跳过）
  if (!skipAutoLineBreaks && lines.length === 1 && text.length > 15) {
    let formattedText = text;
    
    if (text.length > 15 && text.length <= 25) {
      // 在中间位置插入换行符
      const breakPoint = Math.floor(text.length / 2);
      formattedText = text.substring(0, breakPoint) + '\n' + text.substring(breakPoint);
    } else if (text.length > 25) {
      // 对非常长的文本插入两个换行符
      const firstBreak = Math.floor(text.length / 3);
      const secondBreak = Math.floor(text.length * 2 / 3);
      formattedText = text.substring(0, firstBreak) + '\n' + 
                      text.substring(firstBreak, secondBreak) + '\n' + 
                      text.substring(secondBreak);
    }
    
    element.textContent = formattedText;
  }
  
  // 仅对meme2（书页）调整旋转角度，如果未自定义
  if (memeType === 'meme2' && !element.classList.contains('text-custom-rotation') && !element.style.transform.includes('custom')) {
    // 移除默认角度设置，保持居中
    element.style.transform = 'translate(-50%, -50%) rotate(0deg)';
  }
}

// 应用位置数据到文本元素的函数
export function applyPositionData(textElement, positions, containerElement) {
  if (!positions || positions.length !== 4) return;
  
  // 计算四个点的中心
  let centerX = 0, centerY = 0;
  positions.forEach(pos => {
    centerX += pos.x;
    centerY += pos.y;
  });
  centerX /= 4;
  centerY /= 4;
  
  // 使用前两个点计算宽度和角度
  const dx = positions[1].x - positions[0].x;
  const dy = positions[1].y - positions[0].y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // 计算前两个点之间的线段长度
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  
  // 获取容器尺寸
  const containerWidth = containerElement.clientWidth;
  const containerHeight = containerElement.clientHeight;
  
  // 计算相对位置（百分比）
  const relCenterX = (centerX / containerWidth) * 100;
  const relCenterY = (centerY / containerHeight) * 100;
  const relWidth = (lineLength / containerWidth) * 100;
  
  // 应用定位
  textElement.style.top = `${relCenterY}%`;
  textElement.style.left = `${relCenterX}%`;
  textElement.style.width = `${relWidth}%`;
  textElement.style.transformOrigin = 'center center';
  textElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  textElement.classList.add('text-custom-rotation');
  
  // 获取文本内容和行数
  const text = textElement.textContent;
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length));
  
  // 计算每个字符的理想宽度（考虑中文字符）
  const charWidth = lineLength / Math.max(1, maxLineLength);
  
  // 计算字体大小
  const fontSize = Math.max(12, Math.min(24, charWidth * 0.9));
  textElement.style.fontSize = `${fontSize}px`;
  textElement.style.lineHeight = '1.3';
  
  // 处理文字溢出
  textElement.style.overflow = 'hidden';
  textElement.style.textOverflow = 'ellipsis';
  textElement.style.maxHeight = `${lineLength * 1.5}px`;
}