function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('loadTheme', function (pollId) {
    socket.emit('initial', data.getTheme(pollId));
  });

  socket.on('createPoll', function(d) {
    console.log('pollid:'+d.pollId);
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });

  socket.on('chooseTheme', function(d) {
    data.chooseTheme(d.pollId, d.theme);
  });

  socket.on('deleteQuestion',function(d){
   data.deleteQuestion(d.pollId,d.questionNumber);
   socket.emit('getQuestions', data.getAllQuestions(d.pollId));
 });


  socket.on('changeQuestion', function(d){
    data.updateQuestion(d);
    socket.emit('getQuestions', data.getAllQuestions(d.pollId));
  });


  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, d.first);
    socket.emit('getQuestions',data.getAllQuestions(d.pollId));
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('joinPoll', function(d) {
    socket.join(d.pollId);
    socket.emit('newQuestion', data.getQuestion(d.pollId));
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('runQuestion', function(pollId) {
    data.addIndex(pollId);
    data.setAnswersZero(pollId);
    io.to(pollId).emit('newQuestion', data.getQuestion(pollId));
    io.to(pollId).emit('dataUpdate', data.getAnswers(pollId));
    io.to(pollId).emit('changeView', false);
    io.to(pollId).emit('timeStarts');
  });

  socket.on('toPollResult', function(pollId){
    io.to(pollId).emit('changeView',true);
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer,d.userName, d.time);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("recieveQuestions", function(pollId){
    socket.emit('getQuestions',data.getAllQuestions(pollId));
  });
  socket.on("sendEmpty", function(pollId){
    data.emptyAwnser(pollId);
  });

  socket.on("pollQuestions", function(d){
    socket.emit('selectedQuestions',data.setQuestions(d.pollId,d.selectQ));
  });

  socket.on("setAnswers",function(pollId){
    data.setAnswersZero(pollId);
  });

  socket.on("removeAnswer", function(d){
    data.removeAnswerOption(d);
    socket.emit('getQuestions',data.getAllQuestions(d.pollId));
  });

  socket.on("checkLastQuestion", function(pollId){
    socket.emit("isLastQuestion", data.checkIfFinished(pollId));
  });
  socket.on("requestUsers", function(pollId){
    socket.emit("getUsers", data.returnUsers(pollId));
  });

  socket.on("setCorrectAnswer",function(d){
    data.markCorrect(d.pollId, d.questionNumber,d.correctIndex);
    socket.emit("getQuestions",data.getAllQuestions(d.pollId));
  });

  socket.on('user',function(d){
    socket.emit('existingUsers',data.addUser(d.pollId, d.user));
    io.to(d.pollId).emit('allUsers', data.getUsers(d.pollId));
  });

  socket.on('checkPollId', function(pollId){
    socket.emit('existingPolls',data.allIDs(pollId))
  });

  socket.on('getUserInfo', function(d){
    socket.emit('userInfo', data.userInfo(d.pollId,d.userName));
  });

  socket.on('timeToStart',function(pollId){
    io.to(pollId).emit('timeToStart');
  });

  socket.on('timer',function(pollId,time){
    data.setTimer(pollId,time);
  });

  socket.on('getTime',function(pollId){
    io.to(pollId).emit('setTime',data.sendTime(pollId));
  });

  socket.on('startTimer', function(d){
    io.to(d.pollId).emit('timerStart', d);
  });

  socket.on('getUserAmount', function(pollId){
    socket.emit('userAmount', data.getUsers(pollId).length)
  });

}

module.exports = sockets;
