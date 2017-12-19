var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");

var epcis_url = "http://gs1ap.asuscomm.com:8447/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:";

function pickOutObjectEventItems(event) {
    var item_name = new Array();
    var item_value = new Array();
    var event_name = " - ";
    var json_o = {};
    if (event["bizStep"].indexOf("receiving")) {
        event_name = "관리비";
        item_name.push("관리비 부과 날짜");
        item_value.push(event["eventTime"]);
        item_name.push("관리비 금액");
        item_value.push(event["building:extension"]["building:generalCharges"]["building:maintenanceCharges"]);
    }
    else if (event["bizStep"].indexOf("installing")) {
        event_name = "건물등록";
        item_name.push("건물 등록일자");
        item_value.push(event["eventTime"]);
    }

    json_o["event"] = event_name;
    json_o["iName"] = item_name;
    json_o["iValue"] = item_value;
    return json_o;
}

function parseObjectEvent(events) {
    var max_i = 0;
    var event_l = [];
    var json_o = {};
    json_o["ObjectEvent"] = [];
    if (Array.isArray(events))
        max_i = events.length;

    if (max_i == 0) {
        event_l[0] = pickOutObjectEventItems(events);
        json_o["ObjectEvent"][0] = event_l[0];
    }
    else
        for (var i =0; i < max_i; i++) {
            event_l[i] = pickOutObjectEventItems(events[i]);
            json_o["ObjectEvent"][i] = event_l[i];
        }

    console.log(json_o["ObjectEvent"][0]["iName"]);
    console.log(json_o["ObjectEvent"][0]["iValue"]);
    return json_o;
}

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
        var event_list = json_obj["EPCISQueryDocumentType"]["EPCISBody"]["ns3:QueryResults"]["resultsBody"]["EventList"];

        console.log(parseObjectEvent(event_list["ObjectEvent"]));
        //res.json(event_list);
        //res.send(html_str);
        res.render('epcis',  {"iNames": ["A", "B", "C"], "iValues":["a", "b", "c"]});

    }else{
        res.status(401);
        res.json("error : epcis!");
    }
});


module.exports = router;
