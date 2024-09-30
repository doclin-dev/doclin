import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import fs from 'fs';
import alias from '@rollup/plugin-alias';

const production = !process.env.ROLLUP_WATCH;

export default fs.readdirSync(path.join(__dirname, 'webviews', 'pages')).map((input) => {
  const name = input.split('.')[0];
  return {
    input: 'webviews/pages/' + input,
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'out/compiled/' + name + '.js',
    },
    plugins: [
      alias({
        entries: [
          { find: '$shared', replacement: '../shared' },
        ],
      }),

      svelte({
        dev: !production,
        css: (css) => {
          css.write(name + '.css');
        },
        preprocess: sveltePreprocess(),
      }),

      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),

      commonjs(),

      typescript({
        tsconfig: 'webviews/tsconfig.json',
        sourceMap: !production,
        inlineSources: !production,
      }),

      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  };
});