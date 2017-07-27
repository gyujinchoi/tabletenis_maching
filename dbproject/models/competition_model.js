var db=require('../dbconnection'); //reference of dbconnection.js
 
var competition_model={
    //전체 조회
    getAllCompetitions:function(callback){
        return db.query("SELECT * FROM competition",callback);
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
        //console.log(competition.title.replace(/"/g, ""), competition.start_date, competition.end_date, competition.phone, competition.location, competition.account, competition.bank);
        return db.query("insert into competition (title, start_date, end_date, phone, location, account, bank)\n values (?,?,?,?,?,?,?);",
            [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""),
                competition.end_date.replace(/"/g, ""), competition.phone.replace(/"/g, ""),
                competition.location.replace(/"/g, ""), competition.account.replace(/"/g, ""),
                competition.bank.replace(/"/g, "")],
            callback);
    },

    getCompetition:function(competition,callback){
        return db.query("select * from competition where title=? and start_date=? and phone=?",
            [competition.title.replace(/"/g, ""), competition.start_date.replace(/"/g, ""), competition.phone.replace(/"/g, "")],
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