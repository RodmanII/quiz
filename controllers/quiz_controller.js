var models = require('../models/models.js');

exports.load = function(req,res,next,quizId){
  models.Quiz.find({
    where: {id:Number(quizId)},
    include: [{model:models.Comment}]
  }).then(function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }else {next(new Error('No existe quizId='+quizId))}
  }).catch(function(error){next(error)});
};

exports.index = function(req,res,next){
  if(typeof req.query.search!=="undefined"){
    models.Quiz.findAll({where:['LOWER(pregunta) like LOWER(?)', '%' + req.query.search.replace(/ /g,"%") + '%'],order:'pregunta ASC'}).then(function(quizes){
      if(quizes.length>0){
        res.render('quizes/index.ejs',{quizes:quizes, errors:[]});
      }else{
        res.render('quizes/sinresultados.ejs', {errors:[]});
      }
    }).catch(function(error){next(error);});
  }else{
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs',{quizes:quizes, errors:[]});
    });
  }
};

exports.show = function(req,res){
  res.render('quizes/show',{quiz:req.quiz, errors:[]});
};

exports.answer = function(req,res){
  var resultado = 'Incorrecto';
  var sel = 'rinco';
    if(req.query.respuesta === req.quiz.respuesta){
      resultado = 'Correcto';
      sel = 'rcorr';
    }
    res.render('quizes/answer', {quiz:req.quiz,respuesta:resultado,identi:sel,errors:[]});
};

exports.new = function(req,res){
  var quiz = models.Quiz.build({pregunta:'',respuesta:'',tematica:''});
  res.render('quizes/new',{quiz:quiz, errors:[]});
};

exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(function(err){
    if(err){
      res.render('quizes/new', {quiz:quiz, errors:err.errors});
    }else {
      quiz.save({fields:['pregunta','respuesta','tematica']}).then(function(){
       res.render('quizes/exito', {errors:[]});
       //res.redirect('/quizes/');
      });
    }
  });
};

exports.edit = function(req,res){
  var quiz = req.quiz;
  res.render('quizes/edit',{quiz:quiz, errors:[]});
};

exports.update = function(req,res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;
  req.quiz.validate().then(function(err){
    if(err){
      res.render('quizes/edit', {quiz:quiz, errors:err.errors});
    }else{
      req.quiz.save({fields:['pregunta','respuesta','tematica']}).then(
        function(){res.render('quizes/exito', {errors:[]});});
    }
  });
};

exports.destroy = function(req,res){
  req.quiz.destroy().then(function(){
    res.render('quizes/exito', {errors:[]});
  }).catch(function(error){next(error)});
};
