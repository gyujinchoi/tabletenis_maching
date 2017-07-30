var express = require('express');
var router = express.Router();
var player_model = require('../models/player_model');

var player = {
    id: 0,
    name: "",
    phone: "",
    grade: 9,
    gender : ''
};

var group = {
    id: 0,
    name: "",
    phone: ""
};

function getAllPlayers(res){
    player_model.getAllPlayers(function(err,rows){
        if(err){
            res.status(401);
            res.json(err)
        }else
            res.json(rows);
    });
}

router.get('/',function(req,res,next){
    getAllPlayers(res);
});


//GET
router.get('/id?',function(req,res,next){
    if(req.query.id){
        player.id = req.query.id;
        player_model.getPlayerById(player,function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
    }else
        getAllPlayers(res);
});

router.get('/name?',function(req,res,next){
    if(req.query.name){
        player.name = req.query.name;
        player_model.getPlayerByName(player,function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
    } else
        getAllPlayers(res);
});

router.get('/phone?',function(req,res,next){
    if(req.query.phone){
        player.phone = req.query.phone;
        player_model.getPlayerByPhone(player,function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
    } else
        getAllPlayers(res);
});

router.get('/addgroup?',function(req,res,next){
    if(req.query.name && req.query.phone){
        group.name = req.query.name;
        group.phone = req.query.phone;
        player_model.addGroup(group, function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                player_model.getGroupByNameAndPhone(group, function(err, rows){
                    if(err){
                        res.status(401);
                        res.json(err)
                    }else
                        res.json(rows);
                });
        });
    } else
        res.json("error : name and phone must be needed!");
});

router.get('/group?',function(req,res,next){
    if(req.query.name || req.query.phone){
        res.json("Not yes implemented!")
    } else
        player_model.getAllGroups(function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
});

router.get('/apply?', function(req, res, next){
    if(req.query.player_id && req.query.group_id && req.query.event_id) {
        player_model.applyCompetition(req.query.player_id,
            req.query.group_id, req.query.event_id, function(err, rows){
                if(err){
                    res.status(401);
                    res.json(err)
                }else
                    player_model.getParticipant(req.query.player_id,
                        req.query.event_id, function(err, rows) {
                            if(err){
                                res.status(401);
                                res.json(err)
                            }else
                                res.json(rows);
                    });
            });
    }else
        res.json("error : player_id and group_id, event_id are necessary!");
});

router.get('/participant?', function(req, res, next){
    if(req.query.player_id || req.query.event_id) {
        var event_id = -1;
        var player_id = -1;

        if(req.query.event_id)
            event_id =req.query.event_id;

        if(req.query.player_id)
            player_id =req.query.player_id;

        player_model.getParticipants(player_id, event_id,function(err, rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });

    }else
        player_model.getAllParticipants(function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
});

module.exports=router;