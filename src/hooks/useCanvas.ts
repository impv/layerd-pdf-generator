import { useState, useCallback, useRef } from 'react';
import { Point, VectorPath, ToolType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * キャンバス操作のためのカスタムフック
 */
export const useCanvas = (
  addPathToLayer: (layerId: string, path: VectorPath) => void,
  updatePath: (layerId: string, pathId: string, updates: Partial<VectorPath>) => void,
  removePathFromLayer: (layerId: string, pathId: string) => void,
  activeLayerId: string | null
) => {
  // 現在描画中のパス
  const [currentPath, setCurrentPath] = useState<VectorPath | null>(null);
  
  // 選択されたパスのID
  const [selectedPathIds, setSelectedPathIds] = useState<string[]>([]);
  
  // 現在のツール
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  
  // 現在の色
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  
  // 現在の線の太さ
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(2);
  
  // ドラッグ中かどうか
  const isDrawing = useRef(false);
  
  // 最後のポイント
  const lastPoint = useRef<Point | null>(null);

  // マウスダウン時の処理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!activeLayerId) return;

      const stage = e.currentTarget;
      const rect = stage.getBoundingClientRect();
      const point: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      isDrawing.current = true;
      lastPoint.current = point;

      if (currentTool === 'pen') {
        const newPath: VectorPath = {
          id: uuidv4(),
          points: [point],
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
        };
        setCurrentPath(newPath);
      } else if (currentTool === 'select') {
        // 選択ツールの処理
        setSelectedPathIds([]);
      }
      
      console.log('Mouse down at', point);
    },
    [activeLayerId, currentTool, currentColor, currentStrokeWidth]
  );

  // マウス移動時の処理
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDrawing.current || !activeLayerId) return;

      const stage = e.currentTarget;
      const rect = stage.getBoundingClientRect();
      const point: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      if (currentTool === 'pen' && currentPath) {
        console.log('Drawing path at', point);
        setCurrentPath({
          ...currentPath,
          points: [...currentPath.points, point],
        });
      } else if (currentTool === 'move' && selectedPathIds.length > 0) {
        // 移動ツールの処理
        if (lastPoint.current) {
          const dx = point.x - lastPoint.current.x;
          const dy = point.y - lastPoint.current.y;
          console.log('Moving selection by', dx, dy);
          // 選択されたパスを移動する処理を実装
        }
      }

      lastPoint.current = point;
    },
    [activeLayerId, currentTool, currentPath, selectedPathIds]
  );

  // マウスアップ時の処理
  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current || !activeLayerId) return;

    isDrawing.current = false;

    if (currentTool === 'pen' && currentPath) {
      console.log('Finishing path with', currentPath.points.length, 'points');
      // パスを追加
      addPathToLayer(activeLayerId, currentPath);
      setCurrentPath(null);
    }
  }, [activeLayerId, currentTool, currentPath, addPathToLayer]);

  // マウスリーブ時の処理
  const handleMouseLeave = useCallback(() => {
    if (isDrawing.current && activeLayerId && currentTool === 'pen' && currentPath) {
      console.log('Mouse left canvas while drawing, finishing path');
      // パスを追加
      addPathToLayer(activeLayerId, currentPath);
      setCurrentPath(null);
    }
    
    isDrawing.current = false;
  }, [activeLayerId, currentTool, currentPath, addPathToLayer]);

  // パスを選択する
  const selectPath = useCallback((pathId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedPathIds((prev) => 
        prev.includes(pathId)
          ? prev.filter((id) => id !== pathId)
          : [...prev, pathId]
      );
    } else {
      setSelectedPathIds([pathId]);
    }
  }, []);

  // 選択をクリアする
  const clearSelection = useCallback(() => {
    setSelectedPathIds([]);
  }, []);

  return {
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
  };
};
