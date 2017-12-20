var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");
var flatten = require('flat');

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('../node_modules/jade-bootstrap/layouts/bootswatch.pug', { title: 'Express' });
// });

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

function pickOutTransactionEventItems(event) {
    var items = new Array();
    var item_name = new Array();
    var item_value = new Array();
    var event_name = " - ";
    var json_o = {};
    var f_event = flatten(event);
    // console.log(f_event);
    if(f_event["bizStep"].indexOf("retail_selling")){
        event_name = "매매등록";
        item_name.push("매매 등록 날짜");
        item_value.push(f_event['eventTime']);
        // items.push(['매매'])
        item_name.push("매매 상품 번호");
        item_value.push(f_event["epcList.epc"]);
        item_name.push("매물 등록 장소");
        item_value.push(f_event["readPoint.id"]);
        item_name.push("매물 위치");
        item_value.push(f_event["building:extension.building:commonItem.building:location"]);
        item_name.push("매물 고유 번호");
        item_value.push(f_event["building:extension.building:commonItem.building:documentID"]);
        item_name.push("매물 유형");
        item_value.push(f_event["building:extension.building:contractItem.building:contractType"]);
        item_name.push("매물 보증금");
        item_value.push(f_event["building:extension.building:contractItem.building:contractPrice"]);
        item_name.push("매물 월세");
        item_value.push(f_event["building:extension.building:contractItem.building:monthlyPrice"]);
        item_name.push("부동산 중개사");
        item_value.push(f_event["building:extension.building:realEstateAgent.building:companyName"]);
        item_name.push("부동산 전화번호");
        item_value.push(f_event["building:extension.building:realEstateAgent.building:phoneNumber"]);
        item_name.push("부동산 등록번호");
        item_value.push(f_event["building:extension.building:realEstateAgent.building:registrationNumber"]);
        item_name.push("부동산 위치");
        item_value.push(f_event["building:extension.building:realEstateAgent.building:companyLocation"]);
    }
    json_o["event"] = event_name;
    json_o["iName"] = item_name;
    json_o["iValue"] = item_value;
    return json_o;
}


function pickOutTransactionEventItems2Array(event) {
    var items = new Array();
    var item_name = new Array();
    var item_value = new Array();
    var event_name = " - ";
    var json_o = {};
    var f_event = flatten(event);
    // console.log(f_event);
    if(f_event["bizStep"].indexOf("retail_selling")){
        event_name = "매매등록";
        // item_name.push("매매 등록 날짜");
        // item_value.push(f_event['eventTime']);
        items.push(['매매 상품 번호',f_event["epcList.epc"] ]);
        items.push(['매매 등록 날짜', f_event['eventTime']]);
        items.push(['매물 등록 장소', f_event["readPoint.id"]]);
        items.push(['매물 위치',f_event["building:extension.building:commonItem.building:location"]]);

        items.push(['매물 고유 번호',f_event["building:extension.building:commonItem.building:documentID"] ]);
        items.push(['매물 유형', f_event["building:extension.building:contractItem.building:contractType"]]);
        items.push(['매물 보증금', f_event["building:extension.building:contractItem.building:contractPrice"]]);
        items.push(['매물 월세', f_event["building:extension.building:contractItem.building:monthlyPrice"]]);
        items.push(['부동산 중개사', f_event["building:extension.building:realEstateAgent.building:companyName"]]);
        items.push(['부동산 전화번호', f_event["building:extension.building:realEstateAgent.building:phoneNumber"]]);
        items.push(['부동산 등록번호', f_event["building:extension.building:realEstateAgent.building:registrationNumber"]]);
        items.push(['부동산 위치', f_event["building:extension.building:realEstateAgent.building:companyLocation"]]);
    }
    json_o["event"] = event_name;
    json_o["iName"] = items;
    // console.log(items);
    // json_o["iValue"] = item_value;
    return json_o;
}


function parseTransactionEvent(events) {
    var max_i = 0;
    var event_l = [];
    var json_o = {};
    json_o["TransactionEvent"] = [];
    if (Array.isArray(events))
        max_i = events.length;

    if (max_i == 0) {
        event_l[0] = pickOutTransactionEventItems2Array(events);
        json_o["TransactionEvent"][0] = event_l[0];
    }
    else
        for (var i =0; i < max_i; i++) {
            event_l[i] = pickOutTransactionEventItems2Array(events[i]);
            json_o["TransactionEvent"][i] = event_l[i];
        }

    // console.log(json_o["TransactionEvent"][0]["iName"]);
    // console.log(json_o["TransactionEvent"][0]["iValue"]);
    return json_o;
}

router.get('/epcis_main?',function(req,res,next){
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
        // parseTransactionEvent(event_list["TransactionEvent"]);
        var json_trascation = parseTransactionEvent(event_list["TransactionEvent"]);
        console.log(parseTransactionEvent(event_list["TransactionEvent"]));
        res.render('epcis_main.pug',  parseTransactionEvent(event_list["TransactionEvent"]));


    }else{
        res.status(401);
        res.json("error : epcis!");
    }
});

// router.get('/', function(req, res, next) {
//     res.render('epcis_main.pug', { title: 'Express' });
// });

module.exports = router;
