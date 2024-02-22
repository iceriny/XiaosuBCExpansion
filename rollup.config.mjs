// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import progress from 'rollup-plugin-progress';
import packageJson from "./package.json" assert { type: "json" };
import json from "@rollup/plugin-json";

export default {
  input: 'src/main.ts', // 入口文件路径
  output: {
    file: 'dist/XSBCExpansion.js', // 输出文件路径
    format: 'iife', // 输出格式
    sourcemap: true,
    name: 'XiaosuBCExpansion', // 全局变量名称
    intro: async () => {
      let XSBE_VERSION = packageJson.version;
      XSBE_VERSION = (XSBE_VERSION.length > 0 && XSBE_VERSION[0] == 'v') ? XSBE_VERSION : "v" + XSBE_VERSION;
      return `const XSBE_VERSION="${XSBE_VERSION}";
      const DEBUG=false;`;
    },
    plugins: [terser({
      mangle: false
    })]
  },
  plugins: [
    progress({ clearLine: true }),
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", inlineSources: true }), // 使用 TypeScript 插件
    commonjs(),
    json()
  ]
};
