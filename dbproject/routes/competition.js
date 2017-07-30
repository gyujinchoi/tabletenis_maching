var express = require('express');
var router = express.Router();
var competition_model=require('../models/competition_model');

var competition = {
    title : "",
    start_date: "",
    end_date: "",
    phone: "",
    location: "",
    account: 0,
    bank: "",
    passwd: "0000"
};

var event = {
    competition_id: 0,
    title: "",
    max_grade: 0,
    min_grade: 9,
    type: "",
    rule_of_league: 0
};
//GET

router.get('/',function(req,res,next){
    competition_model.getAllCompetitions(function(err,rows){
        if(err) {
            res.json(err);
        } else{
            res.json(rows);
        }
    });
});
router.get('/id?',function(req,res,next){

	if(req.params.id){
		competition_model.getCompetitionById(req.params.id,function(err,rows){
		if(err){
			res.json(err);
		} else{
			res.json(rows);
		}
		 });
	} else{
		competition_model.getAllCompetitions(function(err,rows){
			if(err) {
				res.json(err);
			} else{
				res.json(rows);
			}
		});
	}
 });

router.get('/add?',function(req,res,next){
    if(req.query.title && req.query.start_date &&  req.query.end_date
		&& req.query.phone && req.query.location && req.query.account && req.query.bank){
        competition.title = req.query.title;
        competition.start_date = req.query.start_date;
        competition.end_date = req.query.end_date;
        competition.phone = req.query.phone;
        competition.location = req.query.location;
        competition.account = req.query.account;
        competition.bank = req.query.bank;

        if (req.query.passwd)
            competition.passwd = req.query.passwd;

        competition_model.addCompetition(competition,function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else{
                competition_model.getCompetition(competition, function(err, rows){
                    if(err){
                        res.status(401);
                        res.json(err)
                    }
                    else
                        res.json(rows);
                });
            }
        });
    } else {
        res.status(401);
        res.json("error : All informations must be needed to register competition!");
    }
});

router.get('/get?',function(req,res,next){
    if(req.query.title && req.query.start_date && req.query.phone) {
        competition.title = req.query.title;
        competition.start_date = req.query.start_date;
        competition.phone = req.query.phone;

        competition_model.getCompetition(competition, function(err, rows){
            if(err){
                res.status(401);
                res.json(err)
            }
            else
                res.json(rows);
        });
    }else
        competition_model.getAllCompetitions(function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }
            else
                res.json(rows);
        });
});

router.get('/event/add?',function(req,res,next){
    if(req.query.competition_id && req.query.title &&  req.query.max_grade
        && req.query.min_grade && req.query.type && req.query.rule_of_league){
        event.competition_id = req.query.competition_id;
        event.title = req.query.title;
        event.max_grade = req.query.max_grade;
        event.min_grade = req.query.min_grade;
        event.type = req.query.type;
        event.rule_of_league = req.query.rule_of_league;


        competition_model.addEvent(event,function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            } else{
                competition_model.getEvent(event, function(err, rows){
                    if(err){
                        res.status(401);
                        res.json(err)
                    }else
                        res.json(rows);
                });
            }
        });
    } else
        res.json("error : All informations must be needed to register competition!");
});

router.get('/event/get?',function(req,res,next) {
    if (req.query.competition_id) {
        event.competition_id = req.query.competition_id;
        if (req.query.title && req.query.type) {
            event.title = req.query.title;
            event.type = req.query.type;

            competition_model.getEvent(event, function (err, rows) {
                if (err){
                    res.status(401);
                    res.json(err)
                }else
                    res.json(rows);
            });
        } else {
            competition_model.getEventbyCompetitionId(event, function (err, rows) {
                if (err){
                    res.status(401);
                    res.json(err)
                }else
                    res.json(rows);
            });
        }
    }else if(req.query.event_id) {
        competition_model.getEventbyId(req.query.event_id, function (err, rows) {
            if (err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
	}else
        competition_model.getAllEvents(function(err,rows){
            if(err){
                res.status(401);
                res.json(err)
            }else
                res.json(rows);
        });
});

router.get('/event',function(req,res,next) {
    competition_model.getAllEvents(function(err,rows){
        if(err){
            res.status(401);
            res.json(err)
        }else
            res.json(rows);
    });
});

//POST
router.post('/',function(req,res,next){
	competition_model.addCompetition(req.body,function(err,count){
	  if(err){
          res.status(401);
          res.json(err)
      }else res.json(req.body);//or return count for 1 &amp;amp;amp; 0
	});
 });

//DELETE
router.delete('/id',function(req,res,next){
	competition_model.deleteCompetition(req.params.id,function(err,count){
	 	if(err){
            res.status(401);
            res.json(err)
        }else res.json(count);
	});
});

//PUT
router.put('/id',function(req,res,next){
	competition_model.updateCompetition(req.params.id,req.body,function(err,rows){
		if(err){
		    res.status(401);
            res.json(err)
        }else res.json(rows);
	});
 });

 module.exports=router;