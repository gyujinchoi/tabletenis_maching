var db=require('../dbconnection'); //reference of dbconnection.js

var player_model;
player_model = {
    //player 등록...
    addPlayer: function (player, callback) {
        var insert_player_query = "insert into player (name, phone, grade, gender, passwd)\n";
        insert_player_query += " select ";
        insert_player_query += "'" + player.name + "', ";
        insert_player_query += "'" + player.phone + "', ";
        insert_player_query += player.grade + ", ";
        insert_player_query += "'" + player.gender + "', '" + player.passwd + "' from dual\n";
        insert_player_query += " where not exists (select * from player where ";
        insert_player_query += "(name='" + player.name + "' and phone='" + player.phone + "'))";

        return db.query(insert_player_query, callback);
    },

    //ID로 조회
    getPlayerById: function (player_id, callback) {
        return db.query("SELECT * FROM player WHERE player_id=?", player_id, callback);
    },

    //name으로 조회
    getPlayerByName: function (player_name, callback) {
        return db.query("SELECT * FROM player WHERE name=?", player_name, callback);
    },

    //phone number로 조회
    getPlayerByPhone: function (player_phone, callback) {
        return db.query("SELECT * FROM player WHERE phone=?", player_phone, callback);
    },

    //name and phone number로 조회
    getPlayerByNameAndPhone: function (player, callback) {
        return db.query("SELECT * FROM player WHERE name=? and phone=?", [player.name, player.phone], callback);
    },

    //ID로 조회
    getAllPlayers: function (callback) {
        return db.query("SELECT * FROM player", callback);
    },

    //player 등록...
    addGroup: function (group, callback) {
        var insert_group_query = "insert into tabletennis_competitions.group (name, phone)\n";
        insert_group_query += " select ";
        insert_group_query += "'" + group.name + "', ";
        insert_group_query += "'" + group.phone + "' from dual\n";
        insert_group_query += " where not exists (select * from tabletennis_competitions.group where ";
        insert_group_query += "(name='" + group.name + "' and phone='" + group.phone + "'))";
        return db.query(insert_group_query, callback);
    },

    //name and phone number로 조회
    getGroupByNameAndPhone: function (group, callback) {
        return db.query("SELECT * FROM tabletennis_competitions.group WHERE name=? and phone=?", [group.name, group.phone], callback);
    },

    //name and phone number로 조회
    getAllGroups: function (callback) {
        return db.query("SELECT * FROM tabletennis_competitions.group", callback);
    },

    //대회 참가
    applyCompetition: function (player_id, partner_id, group_id, event_id, callback) {
        /*
            Table: participant
            Columns:
            participant_id	int(11) AI PK
            group_id	int(11)
            player_id	int(11)
            event_id	int(11)
        */

        return db.query("insert into participant (player_id, partner_id, group_id, event_id) select ?,?,?,? from dual" +
            " where not exists (select * from participant where (player_id=? and event_id=?))",
            [player_id, partner_id, group_id, event_id, player_id, event_id],
            callback);
    },

    //대회 참가
    applyCompetitionForDouble: function (player_id, partner_id, group_id, event_id, callback) {
        /*
            Table: participant
            Columns:
            participant_id	int(11) AI PK
            group_id	int(11)
            player_id	int(11)
            event_id	int(11)
        */
        return db.query("insert into participant (player_id, partner_id, group_id, event_id) select ?,?,? from dual" +
            " where not exists (select * from participant where (player_id=? and event_id=?))",
            [player_id[0], partner_id[0], group_id[0], event_id[0], player_id, event_id],
            callback);
    },

    getParticipants: function (player_id, event_id, callback) {
        var query_string = "select * from participant where ";
        var query_values = new Array();
        var i = 0;

        if (event_id > 0) {
            query_string += "event_id=" + event_id;
            query_values[i++] = event_id;
        }

        if (player_id > 0) {
            if (query_string.indexOf("event_id") != -1)
                query_string += " and ";
            query_string += "player_id=" + player_id;
            query_values[i++] = player_id;
        }
        //console.log(query_string);
        return db.query(query_string, query_values, callback);
    },

    getPlayersOfEvent(event_id, callback) {
        var query_string = "select distinct player.*, participant.participant_id, participant.group_id, participant.event_id "
        query_string += "from player, participant where participant.event_id = " + event_id;
        query_string += " and player.player_id = participant.player_id";
        //console.log(query_string);
        return db.query(query_string, callback);
    },

    //round별 시합(match, game, participant, player) 정보를 모두 join한 결과를 반환함.
    getPlayersOfMatches(event_id, round, callback) {
        return db.query("SELECT distinct tabletennis_competitions.`game`.*,\n" +
                        " match_t.match_id, match_t.match_order,\n" +
                        " participant.participant_id, participant.partner_id, participant.group_id,\n" +
                        " player.player_id, player.name, player.phone, player.grade, player.gender\n" +
                        " FROM game, tabletennis_competitions.`match` as match_t, participant, player\n" +
                        " where game.event=? and game.game_round=? and game.game_id=match_t.game_id and participant.participant_id=match_t.parti_id\n" +
                        " and player.player_id=participant.player_id\n" +
                        " order by game.game_order, match_t.match_order;",
                        [event_id, round], callback)
    },

    getAllParticipants: function (callback) {
        return db.query("select * from participant",
            callback);
    }
};

module.exports=player_model;