// 这个文件打包packages下的模块
// node dev.js xxx -f // xxx是包名,-f 模块规范

import minimist from "minimist";
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from "module";
import esbuild from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url);


const args = minimist(process.argv.slice(2));
const target = args._[0] || 'reactivity';
const format = args.f || 'iife';

const entry = resolve(__dirname, '../packages', target, 'src', 'index.ts');
const pkg = require(resolve(__dirname, '../packages', target, 'package.json'));
console.log(resolve(__dirname, '../packages', target, 'dist', `${target}.${format}.js`))

esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, '../packages', target, 'dist', `${target}.${format}.js`),
  bundle: true,
  platform: 'browser',
  sourcemap: true,
  format,
  globalName: pkg.buildOptions?.name,
}).then((ctx) => {
  console.log('打包中');
  return ctx.watch();
})

