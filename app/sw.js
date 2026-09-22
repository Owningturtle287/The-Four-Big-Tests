// Development intentionally does not cache. Production builds generate an offline worker.
self.addEventListener('install',()=>self.skipWaiting());
