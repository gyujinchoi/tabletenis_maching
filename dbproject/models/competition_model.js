var db=require('../dbconnection'); //reference of dbconnection.js
 
var competition_model={
	//전체 조회
	getAllCompetitions:function(callback){
		return db.query("SELECT * FROM tb_test",callback);
	},
	//ID로 조회
	getCompetitionById:function(id,callback){
		return db.query("SELECT * FROM tb_test WHERE id=?",[id],callback);
	},
	
	//대회 추가
	addCompetition:function(competition,callback){
		return db.query("INSERT INTO tb_test values(?,?,?)",[competition.id,competition.name,competition.phone_num],callback);
	},
	//대회 삭제
	deleteCompetition:function(id,callback){
	  return db.query("DELECT FROM tb_test where id=?",[id],callback);
	 },
	 
	//정보 업데이트
	updateCompetition:function(id,competition,callback){
	  return db.query("UPDATE tb_test SET name=?",[competition.name], callback);
	}
 
};

module.exports=competition_model;