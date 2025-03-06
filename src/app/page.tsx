"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LayerPanel from '@/components/LayerPanel';
import ToolBar from '@/components/ToolBar';
import { useLayers } from '@/hooks/useLayers';
import { useCanvas } from '@/hooks/useCanvas';
import { FileFormat } from '@/types';
import { exportToFormat } from '@/utils/exportUtils';

// Canvasコンポーネントをクライアントサイドでのみロードする
const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 bg-white flex items-center justify-center" style={{ width: 800, height: 600 }}>キャンバスを読み込み中...</div>
});

export default function Home() {
  // キャンバスのサイズ
  const [canvasWidth] = useState(800);
  const [canvasHeight] = useState(600);
  
  // 現在選択されているファイル形式
  const [currentFileFormat, setCurrentFileFormat] = useState<FileFormat>('pdf');

  // レイヤー管理フックを使用
  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    renameLayer,
    reorderLayers,
    addPathToLayer,
    removePathFromLayer,
    updatePath,
  } = useLayers();

  // キャンバス操作フックを使用
  const {
    currentPath,
    selectedPathIds,
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    currentStrokeWidth,
    setCurrentStrokeWidth,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    selectPath,
  } = useCanvas(addPathToLayer, updatePath, removePathFromLayer, activeLayerId);

  // 選択された形式でエクスポートする
  const handleExport = () => {
    console.log(`Exporting to ${currentFileFormat} format with ${layers.length} layers`);
    try {
      exportToFormat(
        currentFileFormat,
        layers,
        'layered-drawing',
        canvasWidth,
        canvasHeight
      );
      console.log(`${currentFileFormat.toUpperCase()} exported successfully`);
    } catch (error) {
      console.error(`Error exporting to ${currentFileFormat}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <main className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 左側のパネル */}
          <div className="w-full md:w-64 space-y-4">
            <ToolBar
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              currentStrokeWidth={currentStrokeWidth}
              setCurrentStrokeWidth={setCurrentStrokeWidth}
              currentFileFormat={currentFileFormat}
              setCurrentFileFormat={setCurrentFileFormat}
              onExport={handleExport}
            />

            <LayerPanel
              layers={layers}
              activeLayerId={activeLayerId}
              setActiveLayerId={setActiveLayerId}
              addLayer={addLayer}
              removeLayer={removeLayer}
              toggleLayerVisibility={toggleLayerVisibility}
              toggleLayerLock={toggleLayerLock}
              renameLayer={renameLayer}
              _reorderLayers={reorderLayers}
            />
          </div>

          {/* キャンバス */}
          <div className="flex-grow">
            <Canvas
              layers={layers}
              currentPath={currentPath}
              selectedPathIds={selectedPathIds}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              handleMouseLeave={handleMouseLeave}
              selectPath={selectPath}
              width={canvasWidth}
              height={canvasHeight}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
