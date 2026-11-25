// Keeps the portal on this device so it opens offline, and updates it when a new version is uploaded.
var V = "portal-wdEf2oOoPkoi-mwvxeah5", PRE = "portal-wdEf2oOoPkoi-";
var FILES = ["index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k.indexOf(PRE) === 0 && k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch", function(e){
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;            // score recording, YouTube, Spotify: straight to the internet
  e.respondWith(caches.open(V).then(function(c){
    var key = r.mode === "navigate" ? "index.html" : r;
    return c.match(key, {ignoreSearch: true}).then(function(hit){
      return hit || fetch(r).then(function(res){ if (res.ok && r.mode !== "navigate") c.put(r, res.clone()); return res; });
    });
  }));
});
