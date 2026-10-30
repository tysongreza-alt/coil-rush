/* Atomic offline shell. A new build waits until the player installs it. */
const CACHE='wildkin-shell-3.0.0-dev.4';
const ROOT=new URL('./',self.location.href).href;
const ASSETS=['./index.html','./styles.css?v=3.0.0-dev.4','./adventures.js?v=3.0.0-dev.4','./core.js?v=3.0.0-dev.4','./world.js?v=3.0.0-dev.4','./game.js?v=3.0.0-dev.4','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{await cache.addAll(ASSETS.map(path=>new Request(new URL(path,ROOT),{cache:'reload'})))}
 catch(error){await caches.delete(CACHE);throw error}
})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key!==CACHE&&(key.startsWith('wildkin-shell-')||/^wildkin-v\d/.test(key))).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(ROOT))return;
 if(url.pathname.endsWith('/version.json')){event.respondWith(fetch(event.request,{cache:'no-store'}));return}
 if(event.request.mode==='navigate'){
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(new URL('index.html',ROOT))).then(cached=>cached||fetch(event.request)));return;
 }
 event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request)));
});
