var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");
//var https = require("https");

//var epcis_url = "http://gs1ap.asuscomm.com:8447/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:"


router.get('/epcis?',function(req,res,next){


    if(req.query.gtin) {

        var options = {
            host: 'gs1ap.asuscomm.com',
            port: 8447,
            path: '/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:',
            method: 'GET',
        };

        if(req.query.gtin)
            options.path += req.query.gtin;

        function handleResponse(response) {
            var serverData = '';
            response.on('data', function (chunk) {
                serverData += chunk;
            });
            response.on('end', function () {
                //console.log(serverData);
            });
        }

        http.request(options, function(response){
            handleResponse(response);
        }).end();

        res.json(serverData);

    }else{
        res.status(401);
        res.json("error : epcis!");
    }

});


module.exports = router;