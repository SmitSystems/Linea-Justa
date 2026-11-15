const C="linea-justa-v3",F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
try{importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyC-YfADYR0k0l7xMDjHJGHnwOvB6CrZhg8",authDomain:"linea-justa-53ce9.firebaseapp.com",projectId:"linea-justa-53ce9",storageBucket:"linea-justa-53ce9.firebasestorage.app",messagingSenderId:"233050529312",appId:"1:233050529312:web:f9483bb03470dbcbada645"});
firebase.messaging().onBackgroundMessage(p=>{const d=p.data||{};return self.registration.showNotification(d.title||"Línea Justa",{body:d.body||"",icon:"icon-192.png",tag:d.tag})})}catch(e){}
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>{if(new URL(e.request.url).origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
