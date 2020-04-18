import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import react from 'react';
import reactDom from 'react-dom';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/Main.tsx",
  output: {
    file: "public/bundle.js",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    production && terser(), // minify, but only in production,
    commonjs({
      // https://github.com/rollup/rollup-plugin-commonjs/issues/407#issuecomment-527837831
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom)
      },
    }), // converts date-fns to ES modules
    typescript(),
    replace({
      // https://github.com/rollup/rollup/issues/487#issuecomment-177596512
      'process.env.NODE_ENV': JSON.stringify(production ? "production" : "development")
    })
  ],
  watch: {
    chokidar: {
      usePolling: true
    }
  }
};
