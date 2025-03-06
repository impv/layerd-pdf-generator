"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import LayerPanel from '@/components/LayerPanel';
import ToolBar from '@/components/ToolBar';
import { useLayers } from '@/hooks/useLayers';
import { useCanvas } from '@/hooks/useCanvas';
import { generateAndDownloadPdf } from '@/utils/pdfUtils';

// Canvasコンポーネントをクライアントサイドでのみロードする
const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 bg-white flex items-center justify-center" style={{ width: 800, height: 600 }}>キャンバスを読み込み中...</div>
});

export default function Home() {
  // キャンバスのサイズ
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

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
    clearSelection,
  } = useCanvas(addPathToLayer, updatePath, removePathFromLayer, activeLayerId);

  // PDFを生成してダウンロードする
  const handleGeneratePdf = () => {
    console.log('Generating PDF with', layers.length, 'layers');
    try {
      generateAndDownloadPdf(layers, 'layered-drawing.pdf', canvasWidth, canvasHeight);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center">レイヤー構造を持ったPDF生成ツール</h1>
      </header>

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
              onGeneratePdf={handleGeneratePdf}
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
              reorderLayers={reorderLayers}
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

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 レイヤー構造を持ったPDF生成ツール</p>
      </footer>
    </div>
  );
}
