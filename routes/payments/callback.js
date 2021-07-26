module.exports = {
    callback: (req, res, next) => {
        // Route for verifiying payment
      
        let body = '';
      
        req.on('data', function (data) {
           body += data;
        });
      
        req.on('end', function () {
           let html = "";
           let post_data = qs.parse(body);
      
           // received params in callback
           console.log('Callback Response: ', post_data, "\n");
      
      
           // verify the checksum
           let checksumhash = post_data.CHECKSUMHASH;
           // delete post_data.CHECKSUMHASH;
           let result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
           console.log("Checksum Result => ", result, "\n");
      
      
           // Send Server-to-Server request to verify Order Status
           let params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
      
           checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
      
             params.CHECKSUMHASH = checksum;
             post_data = 'JsonData='+JSON.stringify(params);
      
             let options = {
               hostname: 'securegw-stage.paytm.in',
               port: 443,
               path: '/merchant-status/getTxnStatus',
               method: 'POST',
               headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Content-Length': post_data.length
               }
             };
      
      
             // Set up the request
             let response = "";
             let post_req = https.request(options, function(post_res) {
               post_res.on('data', function (chunk) {
                 response += chunk;
               });
      
               post_res.on('end', function(){
                 console.log('S2S Response: ', response, "\n");
      
                 let _result = JSON.parse(response);
                   if(_result.STATUS == 'TXN_SUCCESS') {
                       res.send('payment sucess')
                   }else {
                       res.send('payment failed')
                   }
                 });
             });
      
             // post the data
             post_req.write(post_data);
             post_req.end();
            });
        });

        next();
    }
}