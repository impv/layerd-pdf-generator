import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Konvaとjspdfをクライアントサイドでのみ使用するための設定
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    
    // react-konvaとjspdfをクライアントサイドでのみ使用するための設定
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-konva$': 'react-konva/lib/ReactKonva',
    };
    
    return config;
  },
  // react-konvaはクライアントサイドでのみ動作するため、SSRを無効にする
  reactStrictMode: true,
};

export default nextConfig;
