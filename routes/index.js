var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* Página de entrada */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors:[] });
});

router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

//Definicion de rutas de session
router.get('/login', sessionController.new);     //Formulario de ingreso
router.post('/login', sessionController.create); //Crea la sesión
router.get('/logout', sessionController.destroy);//Destruye la sesión

router.get('/author', function(req, res, next){
    res.render('author', {errors:[]});
});

//Rutas definidas para Quiz
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

//Rutas definidas para Comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired,  commentController.publish);
module.exports = router;
