var express = require('express');
var router = express.Router();
var player_model = require('../models/player_model');
var competition_model=require('../models/competition_model');
var async = require('async');

var competition_obj = {
    title : "",
    start_date: "",
    end_date: "",
    phone: "",
    location: "",
    account: 0,
    bank: ""
};

var event_obj = {
    competition_id: 0,
    title: "",
    max_grade: 0,
    min_grade: 9,
    type: "",
    rule_of_league: 0
};

var group_obj = {
    id: 0,
    name: "",
    phone: ""
};

var game_obj = {
    order: 1,
    round: 0,
    parent_a: 0,
    parent_b: 0
};
/*
function getPlayersforMatches(index, parti_data, err, player, callback_for_done) {
    player_model.getPlayerById(parti_data.participants[index].player_id, function (err, player) {

    }
}
*/
function getPlayerForMatches(event_id, parti_data, callback_for_done) {

    var num_of_matches = parti_data.event.rule_of_league;
    var num_of_participants = parti_data.participants.length;
    game_obj.round = 0;
    var players = new Array();
    var index = 0;
    var callfunctions = new Array();
    var idx = 0;
    for (var index = 0; index < parti_data.participants.length; index++) {
        callfunctions[index] = function(callback){
            player_model.getPlayerById( parti_data.participants[idx++].player_id, function (err, player) {
                if (err)
                    console.log(err);
                callback(err, player);
            });
        }
    }

    async.parallel(callfunctions, function(err, player) {
        callback_for_done(0, player);
    });
}
/*
function getPlayerForMatches(evnet_id, parti_data, round, callback_for_done) {
    if (round == 0)
        auto_generate_matches_for_round_0(evnet_id, parti_data, callback_for_done);
}
*/

//예선 조를 자동으로 구성한다.
router.get('/autogen?', function(req, res, next){
    if(req.query.event_id) {
        var event_id = -1;
        var parti_data = {
            event: new Object(),
            participants: new Object(),
            players: new Array()
        };
        async.parallel([
                function(callback) {
                    competition_model.getEventbyId(req.query.event_id, function(err, event_rows) {
                        if (err){
                            res.json(err);
                            res.json("error: cannot find event.");
                        } else {
                            player_model.getParticipants(-1, req.query.event_id, function (err, parti_rows) {
                                if (err){
                                    res.status(401);
                                    res.json(err)
                                }else {
                                    console.log(req.query.event_id);
                                    parti_data.event_id = req.query.event_id;
                                    parti_data.participants = parti_rows;
                                    parti_data.event = event_rows[0];

                                    auto_generate_matches(req.query.event_id, parti_data, 0, callback);
                                }
                            });
                        }
                    });
                }
            ],
            function(err, players) {
                parti_data.players = players;

                res.json(parti_data);
            });
    }else
        res.json("error: event id must be inputed.")

});

module.exports=router;