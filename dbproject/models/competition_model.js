var db=require('../dbconnection'); //reference of dbconnection.js
 
var competition_model={
    //전체 조회
    getAllCompetitions:function(callback){
        return db.query("SELECT * FROM competition",callback);
    },
    
    //대회 이름 조회
    getAllCompetitions_title:function(callback){
        return db.query("SELECT title FROM competition",callback);
    },
    
    //ID로 조회
    getCompetitionById:function(id,callback){
        return db.query("SELECT * FROM competition WHERE competition_id=?",[id],callback);
    },

    //대회 추가
    /*
    The DATETIME type is used for values that contain both date and time parts.
    MySQL retrieves and displays DATETIME values in 'YYYY-MM-DD HH:MM:SS' format.
    The supported range is '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.
    */
    addCompetition:function(competition,callback){
        /*
            Table: competition
            Columns:
            competition_id	int(11) AI PK
            title	varchar(45)
            start_date	datetime
            end_date	datetime
            phone	varchar(13)
            location	varchar(45)
            account	bigint(45)
            bank	varchar(45)
         */
        return db.query("insert into competition (title, start_date, end_date, phone, location, passwd)\n values (?,?,?,?,?,?);",
                        [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""),
                        competition.end_date.replace(/"/g, ""), competition.phone.replace(/"/g, ""),
                        competition.location.replace(/"/g, ""),
                        competition.passwd.replace(/"/g, "")],
                        callback);
    },

    getCompetition:function(competition,callback){
        return db.query("select * from competition where title=? and start_date=? and phone=?",
                        [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""), competition.phone.replace(/"/g, "")],
                        callback);
    },

    addEvent:function(event, callback){
        /*
            Table: event
            Columns:
            event_id	int(11) AI PK
            competition_id	int(11)
            max_grade	int(1)
            min_grade	int(1)
            title	varchar(45)
            type	set('M','F','MM','FF','MF')
            rule_of_league	int(11)
         */
        return db.query("insert into tabletennis_competitions.event (competition_id, max_grade, min_grade, title, type, rule_of_league)\n"+
                        " select ?,?,?,?,?,? from dual\n"+
                        " where not exists (select * from tabletennis_competitions.event where (competition_id=? and title=? and type=?))",
                        [event.competition_id, event.max_grade, event.min_grade,
                        "'"+event.title+"'", event.type, event.rule_of_league,
                        event.competition_id, "'"+event.title+"'", event.type],
                        callback);
    },

    getEvent:function(event, callback){
        return db.query("select * from event where competition_id=? and title=? and type=?",
                        [event.competition_id, "'"+event.title+"'", event.type],
                        callback);
    },

    getEventbyCompetitionId:function(event, callback){
        return db.query("select * from event where competition_id=?",
            [event.competition_id],
            callback);
    },

    getEventbyId:function(event_id, callback){
        return db.query("select * from event where event_id=?",
            [event_id],
            callback);
    },

    getAllEvents:function(callback) {
        return db.query("select * from event", callback);
    },

    addGames:function(games, callback){
        /*
            Table: event
            Columns:
            event_id	int(11) AI PK
            competition_id	int(11)
            max_grade	int(1)
            min_grade	int(1)
            title	varchar(45)
            type	set('M','F','MM','FF','MF')
            rule_of_league	int(11)
         */
        var values = [];

        for(var index = 0; index < games.length; index++) {
            values[index] = [games[index].order, games[index].round, games[index].event_id];
        }
        return db.query("insert into tabletennis_competitions.game (game_order, game_round, event) values ?",
            [values],
            callback);
    },

    getGames:function(event_id, round, callback){
        return db.query("select distinct game_t.*, event_t.type from tabletennis_competitions.game as game_t, tabletennis_competitions.event as event_t"
            +" where game_t.game_round=? and game_t.event=? and event_t.event_id=?",
            [round, event_id, event_id],
            callback);
    },

    addMatches:function(matches, callback){
        var values = [];
        var query_string = "insert into tabletennis_competitions.match (match_order, game_id, parti_id) values ?";
        for(var index = 0; index < matches.length; index++) {
            values[index] = [matches[index].match_order, matches[index].game_id, matches[index].participant_id];
        }
        return db.query(query_string,
            [values],
            callback);
    },

    getMatches:function(game_id, callback){
        var values = [];
        var query_string = "select * from tabletennis_competitions.match where game_id=?";
        return db.query(query_string,
            [game_id],
            callback);
    },


    //대회 삭제
    deleteCompetition:function(id,callback){
        return db.query("DELECT FROM competition where id=?",[competition.id],callback);
     },

    //정보 업데이트
    updateCompetition:function(id,competition,callback){
        return db.query("UPDATE competition SET name=?",[competition.name], callback);
    }
 
};

module.exports=competition_model;
