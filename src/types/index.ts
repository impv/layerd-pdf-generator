/**
 * ベクターパスの点を表す型
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * ベクターパスを表す型
 */
export interface VectorPath {
  id: string;
  points: Point[];
  stroke: string;
  strokeWidth: number;
}

/**
 * レイヤーを表す型
 */
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  paths: VectorPath[];
}

/**
 * ツールの種類を表す型
 */
export type ToolType = 'pen' | 'eraser' | 'select' | 'move';

/**
 * ファイル形式の種類を表す型
 */
export type FileFormat = 'svg' | 'pdf';

/**
 * アプリケーションの状態を表す型
 */
export interface AppState {
  layers: Layer[];
  activeLayerId: string | null;
  selectedPathIds: string[];
  currentTool: ToolType;
  currentColor: string;
  currentStrokeWidth: number;
  fileFormat: FileFormat;
}
