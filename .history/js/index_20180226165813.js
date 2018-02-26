//先判断是否有网络，如果有网络，就先清理调所有缓存的资源，重新缓存
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js',{scope:'/flybird.github.io/'}).then(function(registration) {
        // Registration was successful
        const version = '0.0.5';
        const currrent_version = localStorage.getItem('sw_version');
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        if (currrent_version !== version) {
            registration.update().then(function () {
                localStorage.setItem('sw_version', version);
            });
        }
      }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }