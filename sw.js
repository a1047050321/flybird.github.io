var CACHE_NAME = 'my-site-cache-v15';
const ONLINE = navigator.onLine;
if(ONLINE){
  console.log("联网状态");
}else{
  console.log("断网状态");
}
self.addEventListener('install', function(event) {
  // 跳过等待阶段
  
  console.log("当前版本是：",CACHE_NAME);
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
  event.waitUntil(
      Promise.all([
          // 更新客户端
          self.clients.claim(),
          // 清理旧版本
          caches.keys().then(function (cacheList) {
              return Promise.all(
                  cacheList.map(function (cacheName) {                       
                      if (cacheName !== CACHE_NAME) {
                          return caches.delete(cacheName);
                      }
                  })
              );
          })
      ])
  );
});
self.addEventListener('fetch', function (event) {
  event.respondWith(
      caches.match(event.request).then(function (response) {
          // 来来来，代理可以搞一些代理的事情

          // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
          // 如果社保是非联网状态，那么就从缓存中获取资源
          if (!ONLINE) {
               return response;
          }else{
               
               // 如果 service worker 没有返回，那就得直接请求真实远程服务
               //如果设备是联网的，所有访问的资源进行缓存
               /* if(response){
                 return  response;
               } */
                var request = event.request.clone(); // 把原始请求拷过来
                return fetch(request).then(function (httpRes) {

                  // http请求的返回已被抓到，可以处置了。

                  // 请求失败了，直接返回失败的结果就好了。。
                  if (!httpRes || httpRes.status !== 200) {
                      return httpRes;
                  }

                  // 请求成功的话，将请求缓存起来。
                  var responseClone = httpRes.clone();
                  caches.open(CACHE_NAME).then(function (cache) {
                      cache.put(event.request, responseClone);
                  });

                  return httpRes;
              });
          }
          
      })
  );
});