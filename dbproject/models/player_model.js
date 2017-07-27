var db=require('../dbconnection'); //reference of dbconnection.js

var player_model={
    //player 등록...
    addPlayer:function(player, callback){
        var insert_player_query = "insert into player (name, phone, grade, gender)\n";
        insert_player_query += " select ";
        insert_player_query += "'"+ player.name +"', ";
        insert_player_query += "'"+ player.phone +"', ";
        insert_player_query += player.grade +", ";
        insert_player_query += "'"+ player.gender +"' from dual\n";
        insert_player_query += " where not exists (select * from player where ";
        insert_player_query += "(name='"+ player.name +"' and phone='" + player.phone +"'))";

        return db.query(insert_player_query,callback);
    },

    //ID로 조회
    getPlayerById:function(player,callback){
        return db.query("SELECT * FROM player WHERE player_id=?",[player.id],callback);
    },

    //name으로 조회
    getPlayerByName:function(player,callback){
        return db.query("SELECT * FROM player WHERE name=?",[player.name],callback);
    },

    //phone number로 조회
    getPlayerByPhone:function(player,callback){
        return db.query("SELECT * FROM player WHERE phone=?",[player.phone],callback);
    },

    //name and phone number로 조회
    getPlayerByNameAndPhone:function(player,callback){
        return db.query("SELECT * FROM player WHERE name=? and phone=?",[player.name, player.phone],callback);
    },

    //ID로 조회
    getAllPlayers:function(callback){
        return db.query("SELECT * FROM player", callback);
    },

    //player 등록...
    addGroup:function(group, callback){
        var insert_group_query = "insert into tabletennis_competitions.group (name, phone)\n";
        insert_group_query += " select ";
        insert_group_query += "'"+ group.name +"', ";
        insert_group_query += "'"+ group.phone +"' from dual\n";
        insert_group_query += " where not exists (select * from tabletennis_competitions.group where ";
        insert_group_query += "(name='"+ group.name +"' and phone='" + group.phone +"'))";
        return db.query(insert_group_query, callback);
    },

    //name and phone number로 조회
    getGroupByNameAndPhone:function(group, callback){
        return db.query("SELECT * FROM tabletennis_competitions.group WHERE name=? and phone=?",[group.name, group.phone],callback);
    },

    //name and phone number로 조회
    getAllGroups:function(callback){
        return db.query("SELECT * FROM tabletennis_competitions.group", callback);
    },

    //대회 참가
    applyCompetition:function(player, group_id, competition_id, callback){
        //먼저 등록
        addPlayer(player, callback);

    }
};

module.exports=player_model;