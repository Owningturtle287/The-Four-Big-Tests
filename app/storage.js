const DB_NAME='four-big-tests',DB_VERSION=1;
let dbPromise;
export function openDatabase(){
  if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{const db=req.result;db.createObjectStore('attempts',{keyPath:'id'});db.createObjectStore('meta');};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('Close other app tabs to update local storage.'));
  });return dbPromise;
}
async function transaction(store,mode,run){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);let result;try{const req=run(tx.objectStore(store));req.onsuccess=()=>{result=req.result;};}catch(err){reject(err);return;}tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||new Error('Storage failed'));tx.onabort=()=>reject(tx.error||new Error('Storage interrupted'));});}
export const allAttempts=()=>transaction('attempts','readonly',s=>s.getAll());
export const putAttempt=(a)=>transaction('attempts','readwrite',s=>s.put(structuredClone(a)));
export const removeAttempt=(id)=>transaction('attempts','readwrite',s=>s.delete(id));
export const getMeta=(key)=>transaction('meta','readonly',s=>s.get(key));
export const putMeta=(key,value)=>transaction('meta','readwrite',s=>s.put(value,key));
export async function importAttempts(attempts){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('attempts','readwrite');const store=tx.objectStore('attempts');for(const a of attempts)store.put(a);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
