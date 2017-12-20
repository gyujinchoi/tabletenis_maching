var express = require('express');
var router = express.Router();
var async = require('async');
var http = require("http");
var flatten = require('flat');


var epcis_url = "http://gs1ap.asuscomm.com:8447/epcis/Service/Poll/SimpleEventQuery?MATCH_epc=urn:epc:id:sgtin:";

function pickOutObjectEventItems(event) {
    var item_name = new Array();
    var item_value = new Array();
    var event_name = " - ";
    var json_o = {};
    var f_event = flatten(event);
    console.log(f_event);
    if (f_event["bizStep"].indexOf("receiving") >= 0) {
        event_name = "관리비 부과";
        item_name.push("EPC");
        item_value.push(f_event["epcList.epc"]);
        item_name.push("관리비 부과 날짜");
        item_value.push(f_event["eventTime"]);
        item_name.push("관리비 금액");
        item_value.push(f_event["building:extension.building:generalCharges.building:maintenanceCharges"]+"원");
        item_name.push("전기세");
        item_value.push(f_event["building:extension.building:individualCharges.building:electricCharges"]+"원");
        item_name.push("수도세");
        item_value.push(f_event["building:extension.building:individualCharges.building:waterCharges"]+"원");
        item_name.push("난방비");
        item_value.push(f_event["building:extension.building:individualCharges.building:heatingCharges"]+"원");
        item_name.push("가스비");
        item_value.push(f_event["building:extension.building:individualCharges.building:gasCharges"]+"원");
    }
    else if (f_event["bizStep"].indexOf("installing") >= 0) {
        event_name = "건물등록";
        item_name.push("EPC");
        item_value.push(f_event["epcList.epc"]);
        item_name.push("건물 등록일자");
        item_value.push(f_event["eventTime"]);
        item_name.push("건물 주소");
        item_value.push(f_event["building:extension.building:address"]+" "+f_event["building:extension.building:lotNumber"]);
        item_name.push("건물 도로명 주소");
        item_value.push(f_event["building:extension.building:roadAddress"]);
        item_name.push("경도");
        item_value.push(f_event["building:extension.building:hardness"]);
        item_name.push("위도");
        item_value.push(f_event["building:extension.building:latitude"]);
        item_name.push("건물 정보");
        item_value.push("https://www.zigbang.com/danji/"+f_event["building:extension.building:buildingNo"]);
    }

    json_o["event"] = event_name;
    json_o["iName"] = item_name;
    json_o["iValue"] = item_value;
    return json_o;
}

function pickOutTransactionEventItems(event) {
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

function parseEvent(events, event_name, event_pickout_fnc) {
    var max_i = 0;
    var event_l = [];
    var json_o = [];
    //json_o[event_name] = [];
    if (Array.isArray(events))
        max_i = events.length;

    if (max_i == 0) {
        event_l[0] = event_pickout_fnc(events);
        json_o[0] = event_l[0];
    }
    else
        for (var i =0; i < max_i; i++) {
            event_l[i] = event_pickout_fnc(events[i]);
            json_o[i] = event_l[i];
        }

    // console.log(json_o["TransactionEvent"][0]["iName"]);
    // console.log(json_o["TransactionEvent"][0]["iValue"]);
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
        var json_trascation = {};

        console.log("a");
        console.log(event_list);
        console.log("b");

        if (event_list["TransactionEvent"] != undefined)
            json_trascation = parseEvent(event_list["TransactionEvent"], "TransactionEvent", pickOutTransactionEventItems);
        if (event_list["ObjectEvent"] != undefined)
            json_trascation = parseEvent(event_list["ObjectEvent"], "ObjectEvent", pickOutObjectEventItems);
        console.log(json_trascation);
        res.render('epcis',  {EVENTS:json_trascation});
    }else{
        res.status(401);
        res.json("error : epcis!");
    }
});





module.exports = router;
