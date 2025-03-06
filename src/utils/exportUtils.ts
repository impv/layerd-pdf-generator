import { Layer, VectorPath } from '@/types';

/**
 * パスをSVGパス文字列に変換する
 * @param path 変換するパス
 * @returns SVGパス文字列
 */
const pathToSvgPath = (path: VectorPath): string => {
  if (path.points.length < 2) {
    // 点が1つだけの場合は円を描画
    if (path.points.length === 1) {
      const point = path.points[0];
      const size = Math.max(5, path.strokeWidth);
      return `<circle cx="${point.x}" cy="${point.y}" r="${size}" fill="${path.stroke}" />`;
    }
    return '';
  }

  // パスの描画
  const firstPoint = path.points[0];
  let pathData = `M ${firstPoint.x} ${firstPoint.y}`;

  for (let i = 1; i < path.points.length; i++) {
    const point = path.points[i];
    pathData += ` L ${point.x} ${point.y}`;
  }

  return `<path d="${pathData}" stroke="${path.stroke}" stroke-width="${path.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
};

/**
 * レイヤーをSVG要素に変換する
 * @param layer 変換するレイヤー
 * @returns SVG要素の文字列
 */
const layerToSvgElement = (layer: Layer): string => {
  if (!layer.visible) return '';

  // レイヤー内のパスを描画
  const pathElements = layer.paths.map(pathToSvgPath).join('\n  ');
  
  return `<g id="${layer.id}" data-name="${layer.name}">
  ${pathElements}
</g>`;
};

/**
 * レイヤー構造を持ったSVGを生成する
 * @param layers レイヤーの配列
 * @param width SVGの幅
 * @param height SVGの高さ
 * @returns 生成されたSVGの文字列
 */
export const generateLayeredSvg = (
  layers: Layer[],
  width: number = 800,
  height: number = 600
): string => {
  console.log('generateLayeredSvg called with', layers.length, 'layers');
  
  // 各レイヤーをSVG要素に変換
  const layerElements = layers
    .filter(layer => layer.visible)
    .map(layerToSvgElement)
    .join('\n');

  // SVGドキュメントを生成
  const svgDocument = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
${layerElements}
</svg>`;

  return svgDocument;
};

/**
 * SVGをダウンロードする
 * @param svgContent SVGの文字列
 * @param filename ファイル名
 */
export const downloadSvg = (svgContent: string, filename: string = 'layered-drawing.svg') => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * レイヤー構造を持ったSVGを生成してダウンロードする
 * @param layers レイヤーの配列
 * @param filename ファイル名
 * @param width SVGの幅
 * @param height SVGの高さ
 */
export const generateAndDownloadSvg = (
  layers: Layer[],
  filename: string = 'layered-drawing.svg',
  width: number = 800,
  height: number = 600
) => {
  console.log('generateAndDownloadSvg called with', layers.length, 'layers');
  try {
    const svgContent = generateLayeredSvg(layers, width, height);
    console.log('SVG content generated, downloading...');
    downloadSvg(svgContent, filename);
    console.log('SVG download initiated');
  } catch (error) {
    console.error('Error in generateAndDownloadSvg:', error);
    throw error;
  }
};


// FileFormat型はsrc/types/index.tsで定義されているため、ここでは再定義しない
import { FileFormat } from '@/types';

/**
 * 選択されたファイル形式でエクスポートする
 * @param format ファイル形式
 * @param layers レイヤーの配列
 * @param filename ファイル名（拡張子なし）
 * @param width ファイルの幅
 * @param height ファイルの高さ
 */
export const exportToFormat = (
  format: FileFormat,
  layers: Layer[],
  filename: string = 'layered-drawing',
  width: number = 800,
  height: number = 600
) => {
  switch (format) {
    case 'svg':
      generateAndDownloadSvg(layers, `${filename}.svg`, width, height);
      break;
    case 'pdf':
      // PDFエクスポートはpdfUtils.tsから既存の関数を使用
      import('./pdfUtils').then(({ generateAndDownloadPdf }) => {
        generateAndDownloadPdf(layers, `${filename}.pdf`, width, height);
      });
      break;
    default:
      console.error('Unsupported file format:', format);
      throw new Error(`Unsupported file format: ${format}`);
  }
};
