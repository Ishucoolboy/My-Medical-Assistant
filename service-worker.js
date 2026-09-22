const CACHE="mma-v8";
const ASSETS=["./","./index.html","./styles.css","./manifest.json","./data/protocols.json","./data/clinic-rx-protocols.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const isAppCode=url.pathname.endsWith("/app.js");
  const isHtml=e.request.mode==="navigate"||url.pathname.endsWith("/index.html");
  const isWorker=url.pathname.endsWith("/service-worker.js");
  if(isAppCode||isHtml||isWorker){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
  }).catch(()=>cached)));
});