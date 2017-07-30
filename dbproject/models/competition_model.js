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
        return db.query("SELECT * FROM competition WHERE id=?",[competition.id],callback);
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
        db.query("insert into competition (title, start_date, end_date, phone, location, account, bank)\n values (?,?,?,?,?,?,?);",
                        [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""),
                        competition.end_date.replace(/"/g, ""), competition.phone.replace(/"/g, ""),
                        competition.location.replace(/"/g, ""), competition.account.replace(/"/g, ""),
                        competition.bank.replace(/"/g, "")],
                        callback);

        return db.query("select * from competition where title=? and start_date=? and phone=?",
                        [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""), competition.phone.replace(/"/g, "")],
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