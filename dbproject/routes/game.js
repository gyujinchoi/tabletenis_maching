var express = require('express');
var router = express.Router();
var player_model = require('../models/player_model');
var competition_model=require('../models/competition_model');
var async = require('async');

var num_of_grades = 10;

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

function generateMatches(players, max_grade, min_grade, num_of_game_players) {
    //num_of_players : 조별 인원

    var total_players = players[0].length;
    var num_of_game = total_players / num_of_game_players;
    var mod_of_players = total_players % num_of_game_players;
    var num_of_matches = num_of_game_players * (num_of_game_players - 1) / 2;

    if (mod_of_players > 0)
        ++num_of_game;

    var players_per_group = new Array(num_of_grades);
    var games = new Array(num_of_game);

    for (var index = 0; index < num_of_grades; index++)
        players_per_group[index] = new Array();

    for (index = 0; index < players[0].length; index++) {
        players_per_group[players[0][index][0].grade].push(players[0][index][0]);
    }

    console.log(total_players);
    console.log(num_of_game);
    console.log(mod_of_players);
    console.log(min_grade);
    console.log(max_grade);

    for (index = 0; index < num_of_game; ++index) {
        var game_data = {
            order: index,
            round: 0,
            matches: new Array(),
            players: new Array()
        };
        games[index] = game_data;
    }

    for (var grade_idx = max_grade, index=0; grade_idx <= min_grade; grade_idx++, index=0) {
        if (players_per_group[grade_idx].length > 0)
            players_per_group[grade_idx].sort(function (a, b) {
                return 0.5 - Math.random()
            });

        while(players_per_group[grade_idx].length != 0) {
            if (games[index].players.length < num_of_game_players)
                games[index].players.push(players_per_group[grade_idx].pop());
            index = (index+1)%num_of_game;
        }
    }

    return games;
    //조별 인원 구성완료.
    //console.log(games);

}

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
                                    parti_data.event_id = req.query.event_id;
                                    parti_data.participants = parti_rows;
                                    parti_data.event = event_rows[0];

                                    getPlayerForMatches(req.query.event_id, parti_data, callback);
                                }
                            });
                        }
                    });
                }
            ],
            function(err, players) {
                var games;
                parti_data.players = players;
                //console.log(parti_data.event.rule_of_league);
                games = generateMatches(players, parti_data.event.max_grade, parti_data.event.min_grade, parti_data.event.rule_of_league);
                res.json(games);
            });
    }else
        res.json("error: event id must be inputed.")

});

module.exports=router;