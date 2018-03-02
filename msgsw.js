//信息发送
self.addEventListener('message',function(event){
       var promise = self.clients.matchAll().then(function(clientList){
             var send_id = event.source ? event.source.id:'unknown';
             clientList.forEach(function(client){
                    if(client.id == send_id){
                       return ; 
                    }else{
                        client.postMessage({
                             client:send_id,
                             message:event.data
                        });
                    }
             });
       });
       event.waitUntil(promise);
});