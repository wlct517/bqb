'use client';

export default function Instructions() {
  return (
    <div className="card rounded-xl p-5 mt-8">
      <div className="flex items-center mb-4">
        <i className="fas fa-book-open text-pink-500 text-xl mr-3"></i>
        <h3 className="text-xl font-bold">使用说明</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左侧列 */}
        <div className="space-y-4">
          {/* 基本操作 */}
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <i className="fas fa-edit text-pink-500"></i>
              </div>
              <h4 className="font-bold text-gray-800">基本操作</h4>
            </div>
            <ul className="space-y-1.5 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>左侧输入问题文案，右侧输入回应文案</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>输入框中使用空格将文字分行显示</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>每个文案最多支持20个字符</span>
              </li>
            </ul>
          </div>
          
          {/* AI回复 */}
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <i className="fas fa-robot text-pink-500"></i>
              </div>
              <h4 className="font-bold text-gray-800">AI神回复功能</h4>
            </div>
            <ul className="space-y-1.5 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击"DeepSeek神回复"按钮，AI自动生成多个有趣回复</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击右侧下拉箭头查看更多AI生成的回复选项</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>可选择V3（普通）或R1（推理）两种AI模型</span>
              </li>
            </ul>
          </div>
          
          {/* 文字调整 */}
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <i className="fas fa-font text-pink-500"></i>
              </div>
              <h4 className="font-bold text-gray-800">文字调整</h4>
            </div>
            <ul className="space-y-1.5 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>"自定义区域"可调整文字位置、角度和大小</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击4个点确定文字区域，上方2点决定文字方向</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>使用颜色选择器更改文字颜色</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 右侧列 */}
        <div className="space-y-4">
          {/* 保存分享 */}
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <i className="fas fa-share-alt text-pink-500"></i>
              </div>
              <h4 className="font-bold text-gray-800">保存分享</h4>
            </div>
            <ul className="space-y-1.5 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击"复制"将单个表情包复制到剪贴板</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击"导出全部图片"同时下载两个表情包</span>
              </li>
            </ul>
          </div>
          
          {/* 其他功能 */}
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                <i className="fas fa-cog text-pink-500"></i>
              </div>
              <h4 className="font-bold text-gray-800">其他功能</h4>
            </div>
            <ul className="space-y-1.5 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>首次使用需要设置DeepSeek API密钥</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>点击"重置全部"可恢复默认状态</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-pink-400 mt-1 mr-2"></i>
                <span>所有设置和API密钥会自动保存在浏览器中</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}