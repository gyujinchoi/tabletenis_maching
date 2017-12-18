var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");

var epcis_url = "http://gs1ap.asuscomm.com:8447/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:"


router.get('/epcis?',function(req,res,next){


    if(req.query.gtin) {

        /*
        var options = {
            host: 'gs1ap.asuscomm.com',
            port: 8447,
            path: '/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:',
            method: 'GET',
        };
        var serverData = '';
        
        if(req.query.gtin)
            options.path += req.query.gtin;

        function handleResponse(response) {
            var serverData = '';
            response.on('data', function (chunk) {
                serverData += chunk;
                //res.json(serverData);
            });
            response.on('end', function () {
                var parser = require('xml2json');
                //console.log(serverData);
                var json_s = parser.toJson(serverData);
                console.log(json_s);
                res.json(json_s);

            });
        }

        http.request(options, function(response){
            handleResponse(response);
        }).end();

*/
        epcis_query_url = epcis_url + req.query.gtin;
        var request = require('sync-request');
        var response = request('GET', epcis_query_url);
        var parser = require('xml2json');
        var json_str = parser.toJson(response.getBody());
        console.log(json_str);
        res.json(json_str);
    }else{
        res.status(401);
        res.json("error : epcis!");
    }
});


module.exports = router;
