import {cp,rm,readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
await rm('www',{recursive:true,force:true});await cp('../dist','www',{recursive:true});
await build({entryPoints:['entry.js'],bundle:true,outfile:'www/app.js',format:'esm',target:['chrome110','safari16'],minify:true});
// Native assets are packaged with the binary; do not retain a web service worker.
let js=await readFile('www/app.js','utf8');js=js.replace('"serviceWorker"in navigator','false');await writeFile('www/app.js',js);
console.log('Native web assets prepared.');
