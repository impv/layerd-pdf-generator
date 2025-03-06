"use client";

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { Layer as LayerType, VectorPath } from '@/types';

interface CanvasProps {
  layers: LayerType[];
  currentPath: VectorPath | null;
  selectedPathIds: string[];
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  selectPath: (pathId: string, multiSelect?: boolean) => void;
  width?: number;
  height?: number;
}

/**
 * キャンバスコンポーネント
 */
const Canvas: React.FC<CanvasProps> = ({
  layers,
  currentPath,
  selectedPathIds,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  selectPath,
  width = 800,
  height = 600,
}) => {
  const stageRef = useRef<Konva.Stage | null>(null);

  // キャンバスのサイズを設定
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.width(width);
      stageRef.current.height(height);
    }
  }, [width, height]);

  return (
    <div
      className="relative border border-gray-300 bg-white"
      style={{ width, height }}
    >
      {/* マウスイベントをキャプチャするための透明なオーバーレイ */}
      <div
        className="absolute inset-0 z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* 各レイヤーを描画 */}
        {layers.map((layer) => (
          layer.visible && (
            <Layer key={layer.id}>
              {/* レイヤー内のパスを描画 */}
              {layer.paths.map((path) => (
                <Line
                  key={path.id}
                  points={path.points.flatMap((p) => [p.x, p.y])}
                  stroke={path.stroke}
                  strokeWidth={path.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  onClick={(e) => {
                    e.cancelBubble = true;
                    selectPath(path.id, e.evt.shiftKey);
                  }}
                  perfectDrawEnabled={false}
                  listening={!layer.locked}
                  shadowEnabled={selectedPathIds.includes(path.id)}
                  shadowColor="blue"
                  shadowBlur={10}
                  shadowOpacity={0.5}
                />
              ))}
            </Layer>
          )
        ))}

        {/* 現在描画中のパス */}
        {currentPath && (
          <Layer>
            <Line
              points={currentPath.points.flatMap((p) => [p.x, p.y])}
              stroke={currentPath.stroke}
              strokeWidth={currentPath.strokeWidth}
              lineCap="round"
              lineJoin="round"
              perfectDrawEnabled={false}
            />
          </Layer>
        )}
      </Stage>
    </div>
  );
};

export default Canvas;
