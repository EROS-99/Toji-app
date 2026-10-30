const CACHE_NAME = "toji-cache-v15";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./favicon.svg", "./privacy.html", "./terms.html", "./body-muscles-v4.svg"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const isHTML = req.mode === "navigate" || (req.method === "GET" && req.headers.get("accept") && req.headers.get("accept").includes("text/html"));
  if (isHTML) {
    e.respondWith(
      fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }
  // Les appels vers la base de données ne sont jamais mis en cache.
  // Les fichiers de l'app et la bibliothèque (CDN) sont gardés pour le mode hors ligne.
  const host = new URL(req.url).hostname;
  if (host.endsWith("supabase.co")) return;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
      return res;
    }))
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      if (clientsArr.length) return clientsArr[0].focus();
      return self.clients.openWindow((e.notification.data && e.notification.data.url) || "./index.html");
    })
  );
});

self.addEventListener("push", (e) => {
  let d = { title: "TOJI", body: "Tu as une nouvelle notification" };
  try { d = e.data.json(); } catch (err) {}
  e.waitUntil(
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: "./icon-192.png",
      badge: "./icon-192.png",
      data: { url: d.url || "./" }
    })
  );
});
