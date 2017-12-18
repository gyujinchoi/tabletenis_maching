var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");

var epcis_url = "http://gs1ap.asuscomm.com:8447/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:";


router.get('/epcis?',function(req,res,next){
    if(req.query.gtin) {
        var json_parse_options = {
            object: true,
            reversible: false,
            coerce: false,
            sanitize: true,
            trim: true,
            arrayNotation: false,
            alternateTextNode: false
        };
        var request = require('sync-request');
        var response = request('GET', epcis_url + req.query.gtin);
        var parser = require('xml2json');
        var json_obj = parser.toJson(response.getBody(), json_parse_options);
        console.log(json_obj);
        res.json(json_obj);
    }else{
        res.status(401);
        res.json("error : epcis!");
    }
});


module.exports = router;
