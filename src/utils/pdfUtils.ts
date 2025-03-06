import { Layer, VectorPath } from '@/types';
import type { jsPDF as JsPDFType } from 'jspdf';

/**
 * パスをPDFに描画する
 * @param doc jsPDFのインスタンス
 * @param path 描画するパス
 */
const drawPathToPdf = (doc: JsPDFType, path: VectorPath) => {
  if (path.points.length < 2) {
    // 点が1つだけの場合は円を描画
    if (path.points.length === 1) {
      const point = path.points[0];
      
      // 色を設定（16進数から10進数に変換）
      const color = path.stroke.replace('#', '');
      const r = parseInt(color.substring(0, 2), 16) / 255;
      const g = parseInt(color.substring(2, 4), 16) / 255;
      const b = parseInt(color.substring(4, 6), 16) / 255;
      
      // 円のサイズを設定
      const size = Math.max(5, path.strokeWidth);
      
      // 色を設定
      doc.setFillColor(r, g, b);
      
      // 円を描画
      doc.circle(point.x, point.y, size, 'F');
      
      console.log(`Drew circle at (${point.x}, ${point.y}) with size ${size} and color ${path.stroke}`);
    }
    return;
  }

  // 線のスタイルを設定
  doc.setDrawColor(path.stroke);
  doc.setLineWidth(path.strokeWidth / 10); // PDFの単位に合わせて調整

  // パスの描画
  const firstPoint = path.points[0];
  doc.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < path.points.length; i++) {
    const point = path.points[i];
    doc.lineTo(point.x, point.y);
  }

  doc.stroke();
};

/**
 * レイヤーをPDFに描画する
 * @param doc jsPDFのインスタンス
 * @param layer 描画するレイヤー
 */
const drawLayerToPdf = (doc: JsPDFType, layer: Layer) => {
  if (!layer.visible) return;

  // レイヤー内のパスを描画
  layer.paths.forEach((path) => {
    drawPathToPdf(doc, path);
  });
};

/**
 * レイヤー構造を持ったPDFを生成する
 * @param layers レイヤーの配列
 * @param width PDFの幅
 * @param height PDFの高さ
 * @returns 生成されたPDFのBlobオブジェクト
 */
export const generateLayeredPdf = async (
  layers: Layer[],
  width: number = 595,
  height: number = 842
): Promise<Blob> => {
  console.log('generateLayeredPdf called with', layers.length, 'layers');
  
  // サーバーサイドでは実行しない
  if (typeof window === 'undefined') {
    throw new Error('generateLayeredPdf can only be called in the browser');
  }

  try {
    // jsPDFを動的にインポート
    console.log('Importing jsPDF...');
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    console.log('jsPDF imported successfully');

    // jsPDFのインスタンスを作成
    console.log('Creating jsPDF instance...');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [width, height],
    });
    console.log('jsPDF instance created');

    // 各レイヤーを描画
    console.log('Drawing layers...');
    layers.forEach((layer, index) => {
      console.log(`Drawing layer ${index + 1}/${layers.length}: ${layer.name} with ${layer.paths.length} paths`);
      drawLayerToPdf(doc, layer);
    });

    // PDFをBlobとして出力
    console.log('Generating PDF blob...');
    const blob = doc.output('blob');
    console.log('PDF blob generated');
    return blob;
  } catch (error) {
    console.error('Error in generateLayeredPdf:', error);
    throw error;
  }
};

/**
 * PDFをダウンロードする
 * @param blob PDFのBlobオブジェクト
 * @param filename ファイル名
 */
export const downloadPdf = (blob: Blob, filename: string = 'layered-drawing.pdf') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * レイヤー構造を持ったPDFを生成してダウンロードする
 * @param layers レイヤーの配列
 * @param filename ファイル名
 * @param width PDFの幅
 * @param height PDFの高さ
 */
export const generateAndDownloadPdf = async (
  layers: Layer[],
  filename: string = 'layered-drawing.pdf',
  width: number = 595,
  height: number = 842
) => {
  console.log('generateAndDownloadPdf called with', layers.length, 'layers');
  try {
    const blob = await generateLayeredPdf(layers, width, height);
    console.log('PDF blob received, downloading...');
    downloadPdf(blob, filename);
    console.log('PDF download initiated');
  } catch (error) {
    console.error('Error in generateAndDownloadPdf:', error);
    throw error;
  }
};
