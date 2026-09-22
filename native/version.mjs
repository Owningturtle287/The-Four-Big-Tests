// Apply the package version after Capacitor creates the platform project.
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const platform=process.argv[2];
if(!['android','ios'].includes(platform))throw new Error('Usage: node version.mjs android|ios');
const {version}=JSON.parse(await readFile(new URL('./package.json',import.meta.url),'utf8'));
const parts=version.split('.').map(Number);
if(parts.length!==3||parts.some(n=>!Number.isSafeInteger(n)||n<0||n>99))throw new Error('Expected a three-part package version with components below 100.');
const code=parts[0]*10000+parts[1]*100+parts[2];
const path=platform==='android'?join(import.meta.dirname,'android/app/build.gradle'):join(import.meta.dirname,'ios/App/App.xcodeproj/project.pbxproj');
const original=await readFile(path,'utf8');
const next=platform==='android'
 ? original.replace(/\bversionCode\s+\d+/,`versionCode ${code}`).replace(/\bversionName\s+"[^"]+"/,`versionName "${version}"`)
 : original.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g,`CURRENT_PROJECT_VERSION = ${code};`).replace(/MARKETING_VERSION = [^;]+;/g,`MARKETING_VERSION = ${version};`);
if(next===original||!next.includes(platform==='android'?`versionName "${version}"`:`MARKETING_VERSION = ${version};`))throw new Error(`Could not set ${platform} app version; inspect the generated project.`);
await writeFile(path,next);
console.log(`${platform} app version ${version} (${code}).`);
