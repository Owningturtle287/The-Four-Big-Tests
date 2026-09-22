import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xEDB88320^(n>>>1):n>>>1;return n>>>0;});
function crc(buffer){let c=0xFFFFFFFF;for(const b of buffer)c=table[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function chunk(type,data){const t=Buffer.from(type),len=Buffer.alloc(4),check=Buffer.alloc(4);len.writeUInt32BE(data.length);check.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([len,t,data,check]);}
function png(n){const pixels=Buffer.alloc((n*3+1)*n);let i=0;for(let y=0;y<n;y++){pixels[i++]=0;for(let x=0;x<n;x++){const xx=x/n*48,yy=y/n*48;let color=[36,59,145];for(const [j,[a,b]] of [[11,11],[26,11],[11,26],[26,26]].entries())if(xx>=a&&xx<a+11&&yy>=b&&yy<b+11)color=j===3?[167,183,243]:[255,255,255];for(const c of color)pixels[i++]=c;}}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(n);ihdr.writeUInt32BE(n,4);ihdr[8]=8;ihdr[9]=2;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
const platform=process.argv[2];
if(platform==='android'){
 const root='android/app/src/main/res';
 for(const [density,size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})){const dir=`${root}/mipmap-${density}`;await mkdir(dir,{recursive:true});for(const name of ['ic_launcher','ic_launcher_round','ic_launcher_foreground'])await writeFile(`${dir}/${name}.png`,png(size));}
 await mkdir(`${root}/drawable`,{recursive:true});await writeFile(`${root}/drawable/ic_launcher_foreground.xml`,'<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><path android:fillColor="#243b91" android:pathData="M0,0h108v108h-108z"/><path android:fillColor="#ffffff" android:pathData="M30,30h21v21h-21zM57,30h21v21h-21zM30,57h21v21h-21z"/><path android:fillColor="#a7b7f3" android:pathData="M57,57h21v21h-21z"/></vector>');
 console.log('Android icons updated.');
} else if(platform==='ios'){
 const dir='ios/App/App/Assets.xcassets/AppIcon.appiconset';await mkdir(dir,{recursive:true});await writeFile(`${dir}/AppIcon-1024.png`,png(1024));await writeFile(`${dir}/Contents.json`,JSON.stringify({images:[{filename:'AppIcon-1024.png',idiom:'universal',platform:'ios',size:'1024x1024'}],info:{author:'xcode',version:1}},null,2));
 const plistPath='ios/App/App/Info.plist';let plist=await readFile(plistPath,'utf8');if(!plist.includes('UIUserInterfaceStyle'))plist=plist.replace('</dict>','<key>UIUserInterfaceStyle</key><string>Light</string>\n</dict>');await writeFile(plistPath,plist);
 // Filesystem plugin required-reason API declaration. No analytics or tracking.
 await writeFile('ios/App/App/PrivacyInfo.xcprivacy','<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>NSPrivacyTracking</key><false/><key>NSPrivacyAccessedAPITypes</key><array><dict><key>NSPrivacyAccessedAPIType</key><string>NSPrivacyAccessedAPICategoryFileTimestamp</string><key>NSPrivacyAccessedAPITypeReasons</key><array><string>C617.1</string></array></dict></array></dict></plist>');
 console.log('iOS icon and privacy manifest prepared. Add PrivacyInfo.xcprivacy to the App target in Xcode before distribution.');
}else throw new Error('Choose android or ios.');
