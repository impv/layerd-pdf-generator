import { useState, useCallback } from 'react';
import { Layer, VectorPath } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * レイヤー管理のためのカスタムフック
 */
export const useLayers = () => {
  // レイヤーの状態
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: uuidv4(),
      name: 'レイヤー 1',
      visible: true,
      locked: false,
      paths: [],
    },
  ]);

  // アクティブなレイヤーのID
  const [activeLayerId, setActiveLayerId] = useState<string | null>(layers[0]?.id || null);

  // レイヤーを追加する
  const addLayer = useCallback(() => {
    const newLayer: Layer = {
      id: uuidv4(),
      name: `レイヤー ${layers.length + 1}`,
      visible: true,
      locked: false,
      paths: [],
    };
    
    setLayers((prevLayers) => [...prevLayers, newLayer]);
    setActiveLayerId(newLayer.id);
    
    return newLayer;
  }, [layers.length]);

  // レイヤーを削除する
  const removeLayer = useCallback((layerId: string) => {
    setLayers((prevLayers) => {
      const filteredLayers = prevLayers.filter((layer) => layer.id !== layerId);
      
      // アクティブなレイヤーが削除された場合、新しいアクティブレイヤーを設定
      if (activeLayerId === layerId && filteredLayers.length > 0) {
        setActiveLayerId(filteredLayers[0].id);
      } else if (filteredLayers.length === 0) {
        setActiveLayerId(null);
      }
      
      return filteredLayers;
    });
  }, [activeLayerId]);

  // レイヤーの表示/非表示を切り替える
  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  // レイヤーのロック/アンロックを切り替える
  const toggleLayerLock = useCallback((layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? { ...layer, locked: !layer.locked }
          : layer
      )
    );
  }, []);

  // レイヤーの名前を変更する
  const renameLayer = useCallback((layerId: string, newName: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? { ...layer, name: newName }
          : layer
      )
    );
  }, []);

  // レイヤーの順序を変更する
  const reorderLayers = useCallback((startIndex: number, endIndex: number) => {
    setLayers((prevLayers) => {
      const result = Array.from(prevLayers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // パスをレイヤーに追加する
  const addPathToLayer = useCallback((layerId: string, path: VectorPath) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? { ...layer, paths: [...layer.paths, path] }
          : layer
      )
    );
  }, []);

  // パスをレイヤーから削除する
  const removePathFromLayer = useCallback((layerId: string, pathId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              paths: layer.paths.filter((path) => path.id !== pathId),
            }
          : layer
      )
    );
  }, []);

  // パスを更新する
  const updatePath = useCallback((layerId: string, pathId: string, updates: Partial<VectorPath>) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              paths: layer.paths.map((path) =>
                path.id === pathId
                  ? { ...path, ...updates }
                  : path
              ),
            }
          : layer
      )
    );
  }, []);

  // アクティブなレイヤーを取得する
  const getActiveLayer = useCallback(() => {
    return layers.find((layer) => layer.id === activeLayerId) || null;
  }, [layers, activeLayerId]);

  return {
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
    getActiveLayer,
  };
};
