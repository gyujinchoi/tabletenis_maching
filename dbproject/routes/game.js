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


function generateMatches(parti_data, round) {
    //num_of_players : 조별 인원

    var players = parti_data.players[0];
    var total_players = players.length;
    var num_of_game_players =  parti_data.event.rule_of_league;
    var max_grade =  parti_data.event.max_grade;
    var min_grade =  parti_data.event.min_grade;
    var num_of_game = parseInt(total_players / num_of_game_players);
    var mod_of_players = total_players % num_of_game_players;
    //var num_of_matches = num_of_game_players * (num_of_game_players - 1) / 2;
    var order_used_random_deployment = [];

    if (mod_of_players > 0)
        ++num_of_game;

    var players_per_group = new Array(num_of_grades);
    var games = new Array(num_of_game);

    for (var index = 0; index < num_of_grades; index++)
        players_per_group[index] = new Array();

    for (index = 0; index < players.length; index++) {
        players_per_group[players[index].grade].push(players[index]);
    }

    for (index = 0; index < num_of_game; ++index) {
        var game_data = {
            event_id: parti_data.event.event_id,
            order: index+1,
            round: round,
            parent_a: 0,
            parent_b: 0,
            matches: new Array(),
            players: new Array()
        };
        games[index] = game_data;
        order_used_random_deployment[index] = index;
    }

    for (var grade_idx = max_grade, index=0; grade_idx <= min_grade; grade_idx++, index=0) {
        if (players_per_group[grade_idx].length > 0) {
            //선수 선수를 랜덤으로..
            players_per_group[grade_idx].sort(function (a, b) {
                return 0.5 - Math.random();
            });
            //조별 배치를 랜덤으로.
            order_used_random_deployment.sort(function (a, b) {
                return 0.5 - Math.random();
            });
            //group으로 정렬.
            players_per_group[grade_idx].sort(function (player_a, player_b) {
                return player_a.group_id - player_b.group_id;
            });
        }
        //console.log("re random", grade_idx,  order_used_random_deployment);

        while(players_per_group[grade_idx].length != 0) {
            var game_idx = order_used_random_deployment[index];
            if (games[game_idx].players.length < num_of_game_players)
                games[game_idx].players.push(players_per_group[grade_idx].pop());

            if (++index == num_of_game) {
                order_used_random_deployment.sort(function (a, b) {
                    return 0.5 - Math.random()
                });
                //console.log("re random2", grade_idx,  order_used_random_deployment);
            }
            index = index%num_of_game;
        }
    }

    for (index = 0; index < num_of_game; ++index) {
        var match_order = 0;
        for(var player_a_idx = 0; player_a_idx < games[index].players.length; ++player_a_idx) {
            for (var player_b_idx = player_a_idx+1; player_b_idx < games[index].players.length; ++player_b_idx) {
                var match_data ={
                    order: ++match_order,
                    team: new Object(),
                };
                match_data.team = [games[index].players[player_a_idx], games[index].players[player_b_idx]];
                games[index].matches.push(match_data);
            }
        }
    }

    async.parallel([
            function(callback) {
                competition_model.addGames(games, function (err, rows) {
                    if (err && err.errno != 1062) //1062 == ER_DUP_ENTRY: Duplicate entry for key
                        callback(err, rows);
                    callback(0, rows);
                })
            },
            function(callback) {
                competition_model.getGames(games[0].event_id, games[0].round, function (err, rows) {
                    var match_data_for_games = new Array();
                    for(var row_index=0; row_index < rows.length; row_index++) {
                        var game_index = rows[row_index].game_order - 1;
                        for (var match_idx = 0; match_idx < games[game_index].matches.length; ++match_idx) {
                            var match_data_for_game = [{
                                game_id: rows[row_index].game_id,
                                match_order: games[game_index].matches[match_idx].order,
                                participant_id: games[game_index].matches[match_idx].team[0].participant_id
                            },{
                                game_id: rows[row_index].game_id,
                                match_order: games[game_index].matches[match_idx].order,
                                participant_id: games[game_index].matches[match_idx].team[1].participant_id
                            }];
                            match_data_for_games.push(match_data_for_game[0]);
                            match_data_for_games.push(match_data_for_game[1]);
                        }
                    }

                    competition_model.addMatches(match_data_for_games, function(err, rows){
                        if (err && err.errno != 1062)
                            callback(err, rows);
                        else
                            callback(0, rows)
                    });
                })
            },
        ],
        function(err, rows) {
        }
    );

    return games;
}

function getPlayerForMatches(event_id, participants, callback_for_done) {
    var players = new Array();
    var index = 0;
    var callfunctions = new Array();
    var idx = 0;
    game_obj.round = 0;
    for (var index = 0; index < participants.length; index++) {
        callfunctions[index] = function(callback){
            player_model.getPlayerById( participants[idx++].player_id, function (err, player) {
                if (err)
                    console.log(err);

                var participant = {
                    player_id: player[0].player_id,
                    name: player[0].name,
                    phone: player[0].phone,
                    grade: player[0].grade,
                    gender: player[0].gender,
                    group_id: 0
                };
                callback(err, participant);
            });
        }
    }

    async.parallel(callfunctions, function(err, player) {
        callback_for_done(0, player);
    });
}

//예선 조를 자동으로 구성한다.
router.get('/autogen_tmp?', function(req, res, next){
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
                            parti_data.event = event_rows[0];
                            player_model.getPlayersOfEvent(req.query.event_id, function (err, parti_rows) {
                                if (err){
                                    res.status(401);
                                    res.json(err)
                                }else {
                                    parti_data.event_id = req.query.event_id;
                                    callback(err, parti_rows);
                                }
                            });
                        }
                    });
                }
            ],
            function(err, players) {
                var games;
                parti_data.players = players;
                //round 0
                games = generateMatches(parti_data, 0);
                res.json(games);
            });
    }else
        res.json("error: event id must be inputed.")

});

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
                //round 0
                games = generateMatches(players, parti_data.event.event_id, 0, parti_data.event.max_grade, parti_data.event.min_grade, 8);//parti_data.event.rule_of_league);
                res.json(games);
            });
    }else
        res.json("error: event id must be inputed.")

});

module.exports=router;