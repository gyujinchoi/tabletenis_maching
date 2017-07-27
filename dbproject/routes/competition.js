var express = require('express');
var router = express.Router();
var competition_model=require('../models/competition_model');

//GET

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

var competition = {
	title : "",
	start_date: "",
	end_date: "",
	phone: "",
	location: "",
	account: 0,
	bank: ""
};

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

        competition_model.addCompetition(competition,function(err,rows){
            if(err){
                res.json(err);
            } else{
                competition_model.getCompetition(competition, function(err, rows){
                    if(err)
                        res.json(err);
                    else
                        res.json(rows);
                });
            }
        });
    } else
        res.json("error : All informations must be needed to register competition!");
});

router.get('/get?',function(req,res,next){
    if(req.query.title && req.query.start_date && req.query.phone) {
        competition.title = req.query.title;
        competition.start_date = req.query.start_date;
        competition.phone = req.query.phone;

        competition_model.getCompetition(competition, function(err, rows){
            if(err)
                res.json(err);
            else
                res.json(rows);
        });
    }else
        competition_model.getAllCompetitions(function(err,rows){
            if(err) {
                res.json(err);
            } else{
                res.json(rows);
            }
        });
});


//POST
router.post('/',function(req,res,next){
	competition_model.addCompetition(req.body,function(err,count){
	  if(err){
		  res.json(err);
	  }else{
		  res.json(req.body);//or return count for 1 &amp;amp;amp; 0
	  }
	});
 });

//DELETE
router.delete('/id',function(req,res,next){
	competition_model.deleteCompetition(req.params.id,function(err,count){
	 	if(err){
		  res.json(err);
	 	}else{
		  res.json(count);
		}
	});
});

//PUT
router.put('/id',function(req,res,next){
	competition_model.updateCompetition(req.params.id,req.body,function(err,rows){
		if(err){
		  res.json(err);
		}else{
		  res.json(rows);
		}
	});
 });

 module.exports=router;