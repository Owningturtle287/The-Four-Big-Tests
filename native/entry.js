import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
window.fourTestsNative={
  async exportBackup(data,name){
    const result=await Filesystem.writeFile({path:name,data,directory:Directory.Cache,encoding:Encoding.UTF8});
    await Share.share({title:'Four Big Tests — private backup',url:result.uri,dialogTitle:'Save your private backup'});
  }
};
await import('../dist/app.js');
