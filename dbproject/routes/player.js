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
        if(err)
            res.json(err);
        else
            res.json(rows);
    });
}

//GET
router.get('/id?',function(req,res,next){
    if(req.query.id){
        player.id = req.query.id;
        player_model.getPlayerById(player,function(err,rows){
            if(err)
                res.json(err);
            else
                res.json(rows);
        });
    }else
        getAllPlayers(res);
});

router.get('/name?',function(req,res,next){
    if(req.query.name){
        player.name = req.query.name;
        player_model.getPlayerByName(player,function(err,rows){
            if(err)
                res.json(err);
            else
                res.json(rows);
        });
    } else
        getAllPlayers(res);
});

router.get('/phone?',function(req,res,next){
    if(req.query.phone){
        player.phone = req.query.phone;
        player_model.getPlayerByPhone(player,function(err,rows){
            if(err)
                res.json(err);
            else
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
            if(err)
                res.json(err);
            else
                player_model.getGroupByNameAndPhone(group, function(err, rows){
                    if(err)
                        res.json(err);
                    else
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
            if(err)
                res.json(err);
            else
                res.json(rows);
        });
});

module.exports=router;