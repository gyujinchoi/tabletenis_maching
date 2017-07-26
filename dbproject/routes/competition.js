var express = require('express');
var router = express.Router();
var competition_model=require('../models/competition_model');

//GET

router.get('/:id?',function(req,res,next){

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
router.delete('/:id',function(req,res,next){
	competition_model.deleteCompetition(req.params.id,function(err,count){
	 	if(err){
		  res.json(err);
	 	}else{
		  res.json(count);
		}
	});
});

//PUT
router.put('/:id',function(req,res,next){
	competition_model.updateCompetition(req.params.id,req.body,function(err,rows){
		if(err){
		  res.json(err);
		}else{
		  res.json(rows);
		}
	});
 });

 module.exports=router;