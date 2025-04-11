'use client';

export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-center flex items-center">
          <i className="fas fa-mug-hot mr-2 text-pink-500"></i>
          神回复表情包生成器
        </h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 italic bg-pink-50 px-3 py-1 rounded-full border border-pink-200 shadow-sm">
            <i className="fas fa-code mr-1 text-pink-400"></i>制作 by王老禅头
          </span>
        </div>
      </div>
    </header>
  );
}