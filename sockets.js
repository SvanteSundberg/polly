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
    console.log(d.pollId);
    console.log(d.theme);
    data.chooseTheme(d.pollId, d.theme);
  });

  socket.on('deleteQuestion',function(d){
   console.log(d.questionNumber);
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
    io.to(pollId).emit('moveOn');
  });

  socket.on('toPollResult', function(pollId){
    io.to(pollId).emit('changeView');
  });

  socket.on('submitAnswer', function(d) {
    console.log(d.answer);
    data.submitAnswer(d.pollId, d.answer,d.userName);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("recieveQuestions", function(pollId){
    socket.emit('getQuestions',data.getAllQuestions(pollId));
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

  socket.on("setCorrectAnswer",function(d){
    data.markCorrect(d.pollId, d.questionNumber,d.correctIndex);
    socket.emit("getQuestions",data.getAllQuestions(d.pollId));
  });

  socket.on('user',function(d){
    socket.emit('existingUsers',data.addUser(d.pollId, d.user));

  });

  socket.on('checkPollId', function(pollId){
    socket.emit('existingPolls',data.allIDs(pollId))
  });

  socket.on('getUserInfo', function(d){
    console.log("Kom hit");
    socket.emit('userInfo', data.userInfo(d.pollId,d.userName));
  });


}

module.exports = sockets;
