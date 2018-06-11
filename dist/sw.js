!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,r){var o,i=new Promise(function(i,s){e(o=t[n].apply(t,r)).then(i,s)});return i.request=o,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function r(e,n,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return t(this[n],o,arguments)})})}function o(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function i(e,n,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[n],(r=t(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function s(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function a(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new u(n)}function p(e){this._db=e}n(s,"_index",["name","keyPath","multiEntry","unique"]),r(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(c,"_cursor",["direction","key","primaryKey","value"]),r(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),a.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},a.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},n(a,"_store",["name","keyPath","indexNames","autoIncrement"]),r(a,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(a,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),o(a,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new a(this._tx.objectStore.apply(this._tx,arguments))},n(u,"_tx",["objectStoreNames","mode"]),o(u,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new a(this._db.createObjectStore.apply(this._db,arguments))},n(l,"_db",["name","version","objectStoreNames"]),o(l,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},n(p,"_db",["name","version","objectStoreNames"]),o(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[a,s].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,i=o[e].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}})})}),[s,a].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var f={open:function(e,n,r){var o=t(indexedDB,"open",[e,n]),i=o.request;return i.onupgradeneeded=function(e){r&&r(new l(i.result,e.oldVersion,i.transaction))},o.then(function(e){return new p(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=f,module.exports.default=module.exports):self.idb=f}();let staticCacheName="restaurant-reviews-v1",allCaches=[staticCacheName];const urlsToCache=["./index.html","./manifest.json","./sw.js","./img/1.webp","./img/2.webp","./img/3.webp","./img/4.webp","./img/5.webp","./img/6.webp","./img/7.webp","./img/8.webp","./img/9.webp","./img/10.webp","./img/gmaps.webp","./js/all-main.js","./js/all-restaurant.js"];var dbPromise;function syncReviews(){dbPromise.then(e=>{return e.transaction("sync-reviews","readwrite").objectStore("sync-reviews").getAll().then(t=>Promise.all(t.map(t=>{fetch("http://localhost:1337/reviews/",{method:"post",body:JSON.stringify(t)}).then(n=>{let r=e.transaction("sync-reviews","readwrite");return r.objectStore("sync-reviews").delete(t.createdAt),r.complete})})))}).catch(e=>{console.log(e)})}function syncFavourites(){dbPromise.then(e=>{return e.transaction("sync-favourites","readwrite").objectStore("sync-favourites").getAll().then(t=>Promise.all(t.map(t=>{fetch(`http://localhost:1337/restaurants/${t.id}/?is_favorite=${t.is_favorite}`,{method:"put"}).then(n=>{let r=e.transaction("sync-favourites","readwrite");return r.objectStore("sync-favourites").delete(t.id),r.complete})})))}).catch(e=>{console.log(e)})}self.addEventListener("install",e=>{e.waitUntil(caches.open(staticCacheName).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>{if(t)return t;let n=e.request.clone();return fetch(n).then(t=>{if(!t||200!==t.status||"basic"!==t.type)return t;let n=t.clone();return caches.open(staticCacheName).then(t=>{t.put(e.request,n)}),t})}).catch(e=>{console.log("SW: "+e)}))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e.startsWith("restaurant-reviews-")&&!allCaches.includes(e)).map(e=>caches.delete(e)))))}),self.addEventListener("message",e=>{"skipWaiting"==e.data.action&&self.skipWaiting()}),self.addEventListener("sync",e=>{"sync-reviews"==e.tag&&e.waitUntil(syncReviews()),"sync-favourites"==e.tag&&e.waitUntil(syncFavourites())}),dbPromise=idb.open("restaurants-db",1,e=>{e.createObjectStore("restaurants-store",{keyPath:"id"}),e.createObjectStore("sync-reviews"),e.createObjectStore("sync-favourites")});