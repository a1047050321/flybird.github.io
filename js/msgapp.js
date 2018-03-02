//先判断是否有网络，如果有网络，就先清理调所有缓存的资源，重新缓存
if ('serviceWorker'in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('msgsw.js',{scope:'/flybird.github.io/'}).then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope); 
        var btn = document.getElementById('send-msg');
        
        btn.addEventListener('click',function(){
            var va = document.getElementById('msg-value').value;
            console.log("postMessage:",va);
            navigator.serviceWorker.controller.postMessage(va);
        });
      }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err); 
      }); 

      var msgBox = document.getElementById('msg-box');
      navigator.serviceWorker.addEventListener('message',function(event){
          msgBox.innerHTML = msgBox.innerHTML+('<li>'+event.data.message+'</li>'); 
      });

    }); 
   
  }