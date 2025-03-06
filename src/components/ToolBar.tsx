"use client";

import React from 'react';
import { ToolType } from '@/types';

interface ToolBarProps {
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentStrokeWidth: number;
  setCurrentStrokeWidth: (width: number) => void;
  onGeneratePdf: () => void;
}

/**
 * ツールバーコンポーネント
 */
const ToolBar: React.FC<ToolBarProps> = ({
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  currentStrokeWidth,
  setCurrentStrokeWidth,
  onGeneratePdf,
}) => {
  // 利用可能なツール
  const tools: { id: ToolType; name: string; icon: React.ReactNode }[] = [
    {
      id: 'pen',
      name: 'ペン',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      id: 'eraser',
      name: '消しゴム',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    {
      id: 'select',
      name: '選択',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      id: 'move',
      name: '移動',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
  ];

  // 利用可能な色
  const colors = [
    '#000000', // 黒
    '#FF0000', // 赤
    '#00FF00', // 緑
    '#0000FF', // 青
    '#FFFF00', // 黄
    '#FF00FF', // マゼンタ
    '#00FFFF', // シアン
  ];

  // 利用可能な線の太さ
  const strokeWidths = [1, 2, 4, 6, 8, 10];

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">ツール</h3>
        <div className="flex space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`p-2 rounded ${
                currentTool === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setCurrentTool(tool.id)}
              title={tool.name}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">色</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                currentColor === color ? 'border-blue-500' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">線の太さ</h3>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={currentStrokeWidth}
            onChange={(e) => setCurrentStrokeWidth(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">{currentStrokeWidth}px</span>
        </div>
      </div>

      <div>
        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={onGeneratePdf}
        >
          PDFを生成
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
