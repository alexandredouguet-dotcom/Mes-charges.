const CACHE='mes-charges-prive-v15';
const BASE='/Mes-charges/';
const ASSETS=[BASE,BASE+'index.html',BASE+'manifest.webmanifest',BASE+'icon-192.png',BASE+'icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match(BASE+'index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp && resp.status===200){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return resp;
  })));
});
